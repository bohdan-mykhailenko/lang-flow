# 🏗️ Architecture & Technology Stack

LangFlow uses a strategic polyglot architecture combining a high-performance **Rust systems layer** with a rapid-iteration **TypeScript frontend** and serverless edge infrastructure.

---

## 🛠️ Technology Choices & Justification

| Layer | Technology | Free-Tier & Systems Role |
| :--- | :--- | :--- |
| **Edge Gateway & Auth** | Cloudflare Zero Trust (Access) | Edge Google OAuth gating with zero custom auth code. Free up to 50 seats. |
| **Frontend UI** | TanStack Router + Chakra UI v3 | Type-safe routing, accessible compound components, dark mode first. |
| **Frontend Hosting** | Cloudflare Workers / Pages | Globally distributed edge hosting. |
| **Backend API** | Rust (Axum + Tokio + `sqlx`) | Systems-grade performance, memory safety, and sub-millisecond route handling. |
| **Database** | Neon Serverless PostgreSQL | Relational persistence, FSRS state tracking, and native `tsvector` lexical search. |
| **AI Extraction & Tutor** | Google Gemini 1.5/2.5 Pro & Flash | Strict JSON Schema (`responseSchema`) extraction and conversational tool calling. |
| **Agent Protocol** | Model Context Protocol (MCP) | Exposes internal database and study tools to Antigravity and AI clients. |
| **Storage & Audio** | Cloudflare R2 | S3-compatible zero-egress storage for TTS caching. |

---

## 🔒 Security & Quality Gates
- **Rust Backend**: Compiles with zero warnings (`cargo clippy -- -D warnings`).
- **Frontend**: Full TypeScript strict mode verification (`pnpm typecheck`) and flat ESLint 9 rules.
- **Dependency Governance**: Unified dependency versions across the monorepo via Syncpack.
