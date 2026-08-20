# Rust Backend & Systems Standards

## 1. Core Principles

- **Safety & Robustness**: Leverage Rust's strong type system, pattern matching, and RAII. Avoid `.unwrap()` or `.expect()` in production paths; use typed errors.
- **Async Runtime**: Built on `tokio` (multi-threaded runtime) with `axum` for HTTP API routing.
- **Database Access**: Compile-time / type-safe queries using `sqlx` targeting PostgreSQL on Neon.
- **Structured Logging**: Use `tracing` and `tracing-subscriber` for JSON/structured logging across all request pipelines.

---

## 2. Crate Architecture

Split concerns into focused, modular crates:

| Crate               | Responsibility                                                         | Key Dependencies                         |
| :------------------ | :--------------------------------------------------------------------- | :--------------------------------------- |
| `crates/core`       | Domain models, FSRS algorithm math, business logic, validation         | `chrono`, `serde`, `thiserror`           |
| `crates/db`         | Database connection pooling, sqlx queries, migrations, tsvector search | `sqlx`, `tokio`, `tracing`               |
| `crates/ai`         | Gemini client, strict schema builders, prompt execution                | `reqwest`, `serde_json`, `tokio`         |
| `crates/mcp-server` | Model Context Protocol server exposing tool capabilities to AI agents  | `serde_json`, `async-trait`, `tokio`     |
| `crates/api`        | Axum routes, middleware, state injection, CORS, error mappers          | `axum`, `tower-http`, `tokio`, `tracing` |

---

## 3. Error Handling Pattern

Use `thiserror` for domain and library errors, and a custom Axum `IntoResponse` error type for HTTP responses:

```rust
// crates/core/src/error.rs
use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("AI extraction failed: {0}")]
    AiExtraction(String),

    #[error("Entity not found: {0}")]
    NotFound(String),

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("Internal server error")]
    Internal,
}
```

Axum route handlers return `Result<impl IntoResponse, AppError>` where `AppError` transforms cleanly into structured JSON:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Document with id 42 does not exist."
  }
}
```

---

## 4. FSRS (Free Spaced Repetition Scheduler) Algorithm

Implement the FSRS v4 / v5 algorithm directly in `crates/core`:

- **State variables**: Stability ($S$), Difficulty ($D$), Repetitions ($R$), Lapses ($L$).
- **Rating enum**: `Again (1)`, `Hard (2)`, `Good (3)`, `Easy (4)`.
- FSRS mathematical interval calculations must be thoroughly covered with unit tests verifying interval expansion and lapse handling.

---

## 5. API State & Axum Handlers

- Keep state strictly typed via `axum::extract::State(Arc<AppState>)`.
- `AppState` contains connection pool (`PgPool`), Gemini client, and configuration.
- Handlers should be thin: validate input, call `core` / `db` / `ai` services, and return JSON responses.

```rust
#[derive(Clone)]
pub struct AppState {
    pub db: sqlx::PgPool,
    pub gemini: GeminiClient,
}
```

---

## 6. Code Formatting & Quality Verification

All Rust code must strictly comply with:

```bash
cargo fmt --all -- --check
cargo clippy --workspace --all-targets -- -D warnings
cargo test --workspace
```
