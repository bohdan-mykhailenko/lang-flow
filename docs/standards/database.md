# Database & Lexical Search Standards

## 1. Database Engine & Hosting

- **Platform**: Serverless PostgreSQL on **Neon** (or local Postgres for local dev).
- **Migration & Query Layer**: `sqlx-cli` with strictly typed compile-time query verification in Rust.
- **Connection Management**: Async `PgPool` with maximum pool limits configured for serverless scale.

---

## 2. Relational Schema Design

```mermaid
erDiagram
    DOCUMENTS ||--o{ VOCABULARY_ITEMS : contains
    VOCABULARY_ITEMS ||--|| FSRS_CARDS : schedules
    FSRS_CARDS ||--o{ REVIEW_LOGS : records

    DOCUMENTS {
        bigserial id PK
        varchar title
        text content
        varchar source_type
        varchar language
        timestamptz created_at
        tsvector search_vector
    }

    VOCABULARY_ITEMS {
        bigserial id PK
        bigint document_id FK
        varchar target_phrase
        varchar part_of_speech
        varchar aspect_pair
        text translation_uk
        text context_sentence
        text sentence_translation_uk
        varchar etymology_type
        text etymology_notes
        text grammar_notes
        timestamptz created_at
        tsvector search_vector
    }

    FSRS_CARDS {
        bigserial id PK
        bigint vocabulary_id FK
        float8 stability
        float8 difficulty
        int4 repetitions
        int4 lapses
        varchar state
        timestamptz last_review
        timestamptz due
        timestamptz created_at
    }

    REVIEW_LOGS {
        bigserial id PK
        bigint card_id FK
        int2 rating
        varchar state
        timestamptz reviewed_at
        int4 review_duration_ms
    }
```

---

## 3. Full-Text Search (Lexical Precision over Vector Bloat)

To avoid vector search inaccuracies on Slavic prefixes, roots, and inflections:

1. **PostgreSQL `tsvector` with GIN Indexes**:

```sql
ALTER TABLE documents ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (to_tsvector('simple', title || ' ' || content)) STORED;

CREATE INDEX idx_documents_search ON documents USING GIN(search_vector);

ALTER TABLE vocabulary_items ADD COLUMN search_vector tsvector
    GENERATED ALWAYS AS (to_tsvector('simple', target_phrase || ' ' || translation_uk || ' ' || coalesce(context_sentence, ''))) STORED;

CREATE INDEX idx_vocab_search ON vocabulary_items USING GIN(search_vector);
```

2. **Querying via `websearch_to_tsquery` & Substring Fallback**:
   Queries use `plainto_tsquery` / `to_tsquery` for root matching and `ILIKE` for partial prefix matching.
