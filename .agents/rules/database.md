# Database & Lexical Search Rules

- **Engine**: PostgreSQL on Neon.
- **Search Strategy**: Native `tsvector` with GIN indexing for Slavic language root and inflection matching. Do not use vector embeddings or RAG overhead for vocabulary retrieval.
- **Transactions**: Multi-record ingestion and card scheduling updates must be wrapped in `sqlx::Transaction`.
