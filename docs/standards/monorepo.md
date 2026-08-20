# Monorepo & Workspace Standards

## 1. Directory Structure

LangFlow uses a polyglot monorepo structure separating the high-performance Rust systems layer and the modern TypeScript web client, while keeping shared contracts synchronized.

```
lang-flow/
├── AGENTS.md                   # Core agent guidelines & rules
├── Cargo.toml                  # Root Cargo workspace manifest
├── package.json                # Root pnpm/node package scripts
├── pnpm-workspace.yaml         # pnpm workspace definition
├── docs/                       # Architecture & developer standards
│   ├── standards/
│   │   ├── monorepo.md
│   │   ├── rust.md
│   │   ├── frontend.md
│   │   ├── ui-ux.md
│   │   ├── ai-and-mcp.md
│   │   └── database.md
│   └── architecture/
├── crates/                     # Rust backend crates
│   ├── api/                    # Axum web server & route handlers
│   ├── core/                   # Core business logic, FSRS scheduler, domain entities
│   ├── db/                     # sqlx queries, migrations, tsvector search
│   ├── ai/                     # Gemini client, structured output schemas, prompt templates
│   └── mcp-server/             # Model Context Protocol (MCP) server & tool bindings
├── apps/
│   └── web/                    # TanStack Start / Router + Chakra UI v3 application
└── packages/
    └── shared-types/           # Shared TypeScript schemas / generated types
```

---

## 2. Dependency Management & Tooling

- **Rust**: Managed via standard `Cargo.toml` workspace. Workspace dependencies are declared at the root and inherited with `version.workspace = true`.
- **Node / TypeScript**: Managed via **pnpm** (`pnpm-workspace.yaml`).
- **Formatting & Linting**:
  - Rust: `cargo fmt` and `cargo clippy`.
  - Frontend: `biome` or `eslint` + `prettier` with strict TypeScript checks.

---

## 3. Polyglot Type Synchronization

To ensure 100% type compatibility between Rust and TypeScript:

1. Rust structures that define API requests, responses, and Gemini extraction payloads must derive `serde::Serialize` and `serde::Deserialize`.
2. TypeScript types in `packages/shared-types` or `apps/web` must mirror the Rust structs (or be generated via `typeshare` / JSON schema).
3. Schema changes must be atomic: when changing a Rust API payload, update the corresponding TypeScript definition immediately.

---

## 4. Root Commands & Scripts

The root `package.json` provides unified developer commands:

| Command        | Action                                                         |
| :------------- | :------------------------------------------------------------- |
| `pnpm dev`     | Starts frontend Vite dev server and Axum backend concurrently. |
| `pnpm dev:web` | Starts web application dev server.                             |
| `pnpm dev:api` | Runs `cargo watch -x 'run --bin api'`.                         |
| `pnpm test`    | Runs both `cargo test` and frontend test suites.               |
| `pnpm check`   | Runs `cargo check`, `cargo clippy`, and `pnpm typecheck`.      |
| `pnpm format`  | Formats all Rust and TypeScript files.                         |
