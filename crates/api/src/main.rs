use ai::{parse_raw_transcript, GeminiClient, IngestionExtractionResult};
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
pub struct IngestRequest {
    pub title: String,
    pub content: String,
    pub source_type: String,
    pub language: String,
}

#[derive(Serialize)]
pub struct IngestResponse {
    pub message: String,
    pub extracted: IngestionExtractionResult,
}

async fn ingest_handler(
    State(state): State<Arc<AppState>>,
    Json(payload): Json<IngestRequest>,
) -> Result<impl IntoResponse, (StatusCode, String)> {
    let cleaned_text = parse_raw_transcript(&payload.content, &payload.source_type);
    if cleaned_text.trim().is_empty() {
        return Err((StatusCode::BAD_REQUEST, "Content is empty".to_string()));
    }

    let extraction = state
        .gemini
        .extract_vocabulary(&cleaned_text, &payload.language)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()))?;

    Ok((
        StatusCode::OK,
        Json(IngestResponse {
            message: format!("Successfully processed document '{}'", payload.title),
            extracted: extraction,
        }),
    ))
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
    let gemini_key = std::env::var("GEMINI_API_KEY").unwrap_or_default();

    let state = Arc::new(AppState {
        database_url,
        gemini: GeminiClient::new(gemini_key),
    });

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

    let port = std::env::var("PORT").unwrap_or_else(|_| "8081".to_string());
    let addr = format!("0.0.0.0:{}", port);
    let listener = tokio::net::TcpListener::bind(&addr).await?;
    tracing::info!("🚀 LangFlow Axum API listening on http://{}", addr);

    axum::serve(listener, app).await?;
    Ok(())
}
