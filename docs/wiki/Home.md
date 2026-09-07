# 🌊 Welcome to LangFlow

**LangFlow** is an AI-powered, active-recall language acquisition platform designed to accelerate fluency in **Bulgarian** (and extensible to Polish and French).

It eliminates manual flashcard creation overhead by turning unstructured raw notes, media transcripts, YouTube `.vtt` subtitles, and NotebookLM exports into an active-recall Spaced Repetition System (SRS).

---

## 🎯 Core Motivations & Vision

1. **Zero Flashcard Overhead**: Ingest any text or dialogue transcript and immediately receive 15–30 fully structured study cards with translations, aspect pairs, and etymology.
2. **Context-Preserved Active Recall**: Every flashcard links directly back to the authentic sentence and original document where the word was encountered.
3. **Slavic Linguistic Nuance**: Deep support for Slavic language mechanics—contextual Ukrainian translations, verb aspect pairs (e.g. _свиквам / свикна_), Slavic cognates, and false friends (_⚠️ False Friends_).
4. **Database-Aware AI Tutor**: Conversational tutor powered by Gemini Function Calling and Model Context Protocol (MCP) to query notes and generate new cards directly into the database.
5. **Zero-Cost & Edge-First Architecture**: 100% free-tier deployment gated securely at the edge.

---

## 🏛️ System Architecture

```
┌────────────────────────────────────────────────────────┐
│                   Ingestion Layer                      │
│     Raw Transcripts • YouTube Subtitles • NotebookLM   │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│              Gemini Structured Extraction              │
│       Strict JSON Schema (responseSchema Validation)   │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│                 Rust Axum Core API                     │
│    Tokio Runtime • FSRS Scheduler Engine • MCP Server  │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│               Neon PostgreSQL Database                 │
│      Relational FSRS States • tsvector Lexical Search  │
└───────────────────────────┬────────────────────────────┘
                            ▼
┌────────────────────────────────────────────────────────┐
│           TanStack Start + Chakra UI v3                │
│    3D Flashcards • Web Speech API TTS • Dark Mode UI   │
└────────────────────────────────────────────────────────┘
```

---

## 🧭 Explore the Wiki

- [[Architecture & Tech Stack|Architecture-&-Tech-Stack]]
- [[Spaced Repetition (FSRS)|Spaced-Repetition-(FSRS)]]
- [[Lexical Search vs Vector RAG|Lexical-Search-vs-Vector-RAG]]
- [[Model Context Protocol (MCP)|Model-Context-Protocol-(MCP)]]
