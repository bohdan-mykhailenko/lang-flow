# LangFlow Agent Guidelines & Development Operating Rules

Welcome to **LangFlow**, an AI-powered, active-recall language learning platform (Rust Axum + TanStack/Chakra UI v3 + Neon PostgreSQL + Gemini + MCP).

Every AI agent and contributor operating on this codebase **MUST** strictly adhere to the standards, architecture, and rules outlined in this document and the referenced `docs/standards/` guides.

---

## 🧭 Standards & Documentation Index

Before writing, refactoring, or reviewing code, consult the domain-specific standards:

1. [Monorepo & Workspace Standards](file:///docs/standards/monorepo.md) — Cargo + pnpm workspace structure, scripts, shared types.
2. [Rust Backend & Systems Standards](file:///docs/standards/rust.md) — Axum, Tokio, `sqlx`, error handling, FSRS math, tracing.
3. [Frontend & React Standards](file:///docs/standards/frontend.md) — TanStack, Chakra UI v3, compound components, state management.
4. [UI/UX & Design Philosophy](file:///docs/standards/ui-ux.md) — Visual excellence, dark mode, keyboard ergonomics, TTS audio.
5. [AI & MCP Integration Rules](file:///docs/standards/ai-and-mcp.md) — Gemini JSON schemas, MCP tools, deterministic tool execution.
6. [Database & Lexical Search Standards](file:///docs/standards/database.md) — Neon PostgreSQL, `tsvector` full-text search, migrations.
7. [Agent Workflow & Delivery Loop](file:///docs/standards/organization-and-agent-workflow.md) — 4-stage delivery loop, design research, plan lifecycle.

---

## ⚡ Golden Rules for AI Agents

### 1. "AI-Friendly & Deterministic" Principle

- If a tool or technology is not AI-friendly, typed, and deterministic, **we do not use it**.
- All AI outputs from Gemini (extraction, parsing, grammar analysis) **must** use strict JSON schema (`responseSchema`) with `serde` validation on the Rust backend and Zod/TypeScript types on the frontend.
- Expose core functionality as **Model Context Protocol (MCP)** tools so external agents and internal tutors can interact with the app naturally.

### 2. Zero-Cost & Edge-First Architecture

- Keep operational cost at **$0.00/month** by leveraging free-tier primitives:
  - Cloudflare Zero Trust (Edge OAuth gating)
  - Cloudflare Workers / Shuttle / Fly.io for hosting
  - Neon Serverless PostgreSQL
  - Cloudflare R2 (zero egress fees for audio)
- No heavy vector DBs or embeddings overhead — use PostgreSQL native `tsvector` with Slavic root matching.

### 3. Strict Quality & Verification Gate

- **Rust**: Must pass `cargo check`, `cargo clippy -- -D warnings`, and `cargo fmt --check`.
- **Frontend**: Must pass `pnpm typecheck` and `pnpm lint`.
- **No placeholders**: Every UI component must be fully styled, interactive, and visually stunning.
