---
name: worktrees
description: Manage the repository's 4 parallel git worktree workspaces (lang-flow, lang-flow-1, lang-flow-2, lang-flow-3) for concurrent agent execution with zero branch or port collisions.
---

# Parallel Git Worktrees Architecture

The repository operates across 4 linked git worktrees:

- `C:/Users/bamyk/Repositories/personal/lang-flow` (Workspace 0 / Orchestrator)
- `C:/Users/bamyk/Repositories/personal/lang-flow-1` (Workspace 1 / Agent 1: Ingestion & AI)
- `C:/Users/bamyk/Repositories/personal/lang-flow-2` (Workspace 2 / Agent 2: FSRS Engine & Database)
- `C:/Users/bamyk/Repositories/personal/lang-flow-3` (Workspace 3 / Agent 3: QA, Testing & E2E Verification)

```
git worktree list
```

---

## 🔌 Fixed Port Assignments

| Workspace       | Working Directory | Axum API (`PORT`) | Web App (`PORT`) | Dedicated Role                    |
| :-------------- | :---------------- | :---------------- | :--------------- | :-------------------------------- |
| **Workspace 0** | `lang-flow`       | `8080`            | `3000`           | **Orchestrator & Lead**           |
| **Workspace 1** | `lang-flow-1`     | `8081`            | `3001`           | **Agent 1: Ingestion & AI**       |
| **Workspace 2** | `lang-flow-2`     | `8082`            | `3002`           | **Agent 2: FSRS & Database**      |
| **Workspace 3** | `lang-flow-3`     | `8083`            | `3003`           | **Agent 3: QA, Testing & Audits** |

---

## 🔄 Delivery & Audit Loop

1. Feature agent implements in their dedicated worktree (`lang-flow-1` or `lang-flow-2`).
2. Self-audit & test verification are mandatory before PR opening (`pnpm typecheck`, `pnpm lint`, `pnpm test`).
3. QA agent (`lang-flow-3`) performs independent integration validation across endpoints and UI states.
