use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::IntoResponse,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tower_http::cors::{Any, CorsLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

#[derive(Clone)]
pub struct AppState {
    pub database_url: String,
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
pub struct IngestRequest {
    pub title: String,
    pub content: String,
    pub source_type: String,
    pub language: String,
}

#[derive(Serialize)]
pub struct IngestResponse {
    pub message: String,
    pub card_count: usize,
}

async fn ingest_handler(
    State(_state): State<Arc<AppState>>,
    Json(payload): Json<IngestRequest>,
) -> impl IntoResponse {
    (
        StatusCode::ACCEPTED,
        Json(IngestResponse {
            message: format!("Document '{}' queued for AI extraction.", payload.title),
            card_count: 0,
        }),
    )
}

#[derive(Deserialize)]
pub struct SearchQuery {
    pub q: String,
}

async fn search_handler(
    State(_state): State<Arc<AppState>>,
    Query(query): Query<SearchQuery>,
) -> impl IntoResponse {
    (
        StatusCode::OK,
        Json(serde_json::json!({
            "query": query.q,
            "results": []
        })),
    )
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

    let state = Arc::new(AppState { database_url });

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/health", get(health_handler))
        .route("/api/ingest", post(ingest_handler))
        .route("/api/search", get(search_handler))
        .layer(cors)
        .with_state(state);

    let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
    let addr = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!("🚀 LangFlow Axum API listening on http://{}", addr);

    axum::serve(listener, app).await?;
    Ok(())
}
