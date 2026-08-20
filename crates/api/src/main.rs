use ai::{parse_raw_transcript, GeminiClient, IngestionExtractionResult};
use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use core::{Card, Rating, ReviewRecord};
use db::{queries, DbPool};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Clone)]
pub struct AppState {
    pub database_url: String,
    pub pool: Option<DbPool>,
    pub gemini: GeminiClient,
}

#[derive(Serialize)]
pub struct HealthResponse {
    pub status: &'static str,
    pub service: &'static str,
    pub version: &'static str,
}

async fn health_handler() -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(HealthResponse {
            status: "healthy",
            service: "lang-flow-api",
            version: "0.1.0",
        }),
    )
}

#[derive(Deserialize)]
pub struct DueCardsQuery {
    pub limit: Option<i64>,
}

#[derive(Serialize)]
pub struct DueCardsResponse {
    pub count: usize,
    pub cards: Vec<Card>,
}

async fn get_due_cards_handler(
    State(state): State<Arc<AppState>>,
    Query(query): Query<DueCardsQuery>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let limit = query.limit.unwrap_or(20);
    if let Some(ref pool) = state.pool {
        let cards = queries::fetch_due_cards(pool, limit)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
        let count = cards.len();
        Ok((StatusCode::OK, Json(DueCardsResponse { count, cards })))
    } else {
        Ok((StatusCode::OK, Json(DueCardsResponse { count: 0, cards: vec![] })))
    }
}

#[derive(Deserialize)]
pub struct ReviewCardRequest {
    pub card_id: i64,
    pub rating: Rating,
}

async fn review_card_handler(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<ReviewCardRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    if let Some(ref pool) = state.pool {
        let record = queries::save_card_review(pool, payload.card_id, payload.rating)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;
        Ok((StatusCode::OK, Json(record)))
    } else {
        let mut card = Card::new(payload.card_id, 100);
        let record = card.schedule_next(payload.rating, chrono::Utc::now());
        Ok((StatusCode::OK, Json(record)))
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "info,lang_flow_api=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let database_url =
        std::env::var("DATABASE_URL").unwrap_or_else(|_| "postgres://localhost/lang_flow".to_string());
    let gemini_key = std::env::var("GEMINI_API_KEY").unwrap_or_default();

    let pool = db::create_pool(&database_url).await.ok();

    let state = Arc::new(AppState {
        database_url,
        pool,
        gemini: GeminiClient::new(gemini_key),
    });

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/health", get(health_handler))
        .route("/api/cards/due", get(get_due_cards_handler))
        .route("/api/cards/review", post(review_card_handler))
        .layer(cors)
        .with_state(state);

    let port = std::env::var("PORT").unwrap_or_else(|_| "8082".to_string());
    let addr = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!("🚀 LangFlow Axum API listening on http://{}", addr);

    axum::serve(listener, app).await?;
    Ok(())
}
