---
name: run-local
description: Operational reference for starting, testing, and debugging the local LangFlow development environment.
---

# Run Local Development Environment

| Service              | Command                       | Port                    | Notes                      |
| :------------------- | :---------------------------- | :---------------------- | :------------------------- |
| **Frontend Web**     | `pnpm dev:web`                | `http://localhost:3000` | Vite + Chakra UI v3        |
| **Rust API Server**  | `cargo run --bin api`         | `http://localhost:8080` | Axum HTTP server           |
| **Lint & Typecheck** | `pnpm typecheck && pnpm lint` | -                       | Monorepo verification      |
| **Dependency Check** | `pnpm lint:deps`              | -                       | Syncpack version alignment |
