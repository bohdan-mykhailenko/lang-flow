# MVP Functional Requirements — LangFlow (v1.0)

## 1. Executive Summary & Product Objective

LangFlow is an AI-powered language acquisition and spaced repetition system (SRS) targeting **Bulgarian** (with contextual Ukrainian translations, Slavic cognates, and grammatical aspect pairs), built on a language-agnostic data model extensible to Polish and French.

---

## 2. Core Functional Requirements

### A. Ingestion & Structured AI Extraction

- **REQ-INGEST-1**: Accept raw text inputs, `.vtt` YouTube subtitle transcripts, and NotebookLM markdown exports via UI drag-and-drop or text paste.
- **REQ-INGEST-2**: Ingested text is processed through Gemini with strict JSON Schema (`responseSchema`) to extract 15–30 vocabulary items per 1,000 words.
- **REQ-INGEST-3**: Extraction payload must contain:
  - Target phrase/lemma and part of speech.
  - Aspect pair (imperfective/perfective) for verbs.
  - Contextual Ukrainian translation.
  - In-situ context sentence extracted directly from source text.
  - Etymology classification (`slavic_cognate`, `false_friend`, `loanword_ottoman`, `loanword_french`, `native`).
  - Grammar notes (definite article forms, plural, preposition governance).

### B. Spaced Repetition (FSRS Engine)

- **REQ-FSRS-1**: Each extracted vocabulary item generates an active recall flashcard scheduled using the Free Spaced Repetition Scheduler (FSRS) algorithm.
- **REQ-FSRS-2**: Card review states support 4 ratings: `Again` (1), `Hard` (2), `Good` (3), `Easy` (4).
- **REQ-FSRS-3**: Review interface provides keyboard shortcuts (1–4, Space) and native Web Speech API pronunciation.

### C. Lexical Search & Database-Aware Tutor

- **REQ-SEARCH-1**: Sub-millisecond full-text search across all ingested documents and vocabulary using PostgreSQL `tsvector` with Slavic root and inflection matching.
- **REQ-TUTOR-1**: Interactive AI tutor equipped with function calling / MCP tools:
  - `search_library(query)`
  - `create_flashcard(...)`
  - `get_due_cards()`
