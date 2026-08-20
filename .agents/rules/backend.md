# Rust Backend Rules & Architecture

- **Runtime**: Tokio async runtime + Axum HTTP framework.
- **Error Handling**: Use `core::AppError` with `thiserror`. Never `.unwrap()` in production paths.
- **FSRS Math**: Keep FSRS mathematical equations strictly in `crates/core/src/fsrs.rs`.
- **Database**: Use `sqlx` query macros and connection pooling from `crates/db`.
- **AI Contracts**: Ingestion extraction and Gemini function calls must serialize/deserialize to schemas in `crates/ai/src/schema.rs`.
