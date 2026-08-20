use sqlx::{postgres::PgPoolOptions, PgPool};
use std::time::Duration;

pub type DbPool = PgPool;

pub async fn create_pool(database_url: &str) -> Result<DbPool, sqlx::Error> {
    PgPoolOptions::new()
        .max_connections(10)
        .acquire_timeout(Duration::from_secs(5))
        .connect(database_url)
        .await
}

pub const SCHEMA_MIGRATION_SQL: &str = r#"
CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    source_type VARCHAR(50) NOT NULL DEFAULT 'manual',
    language VARCHAR(10) NOT NULL DEFAULT 'bg',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    search_vector tsvector GENERATED ALWAYS AS (to_tsvector('simple', title || ' ' || content)) STORED
);

CREATE INDEX IF NOT EXISTS idx_documents_search ON documents USING GIN(search_vector);

CREATE TABLE IF NOT EXISTS vocabulary_items (
    id BIGSERIAL PRIMARY KEY,
    document_id BIGINT REFERENCES documents(id) ON DELETE SET NULL,
    target_phrase VARCHAR(255) NOT NULL,
    part_of_speech VARCHAR(50) NOT NULL,
    aspect_pair VARCHAR(255),
    translation_uk TEXT NOT NULL,
    context_sentence TEXT NOT NULL,
    sentence_translation_uk TEXT,
    etymology_type VARCHAR(50) NOT NULL DEFAULT 'slavic_cognate',
    etymology_notes TEXT,
    grammar_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    search_vector tsvector GENERATED ALWAYS AS (to_tsvector('simple', target_phrase || ' ' || translation_uk || ' ' || coalesce(context_sentence, ''))) STORED
);

CREATE INDEX IF NOT EXISTS idx_vocab_search ON vocabulary_items USING GIN(search_vector);

CREATE TABLE IF NOT EXISTS fsrs_cards (
    id BIGSERIAL PRIMARY KEY,
    vocabulary_id BIGINT UNIQUE NOT NULL REFERENCES vocabulary_items(id) ON DELETE CASCADE,
    stability DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    difficulty DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    repetitions INTEGER NOT NULL DEFAULT 0,
    lapses INTEGER NOT NULL DEFAULT 0,
    state VARCHAR(50) NOT NULL DEFAULT 'New',
    last_review TIMESTAMPTZ,
    due TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_fsrs_due ON fsrs_cards(due);
"#;
