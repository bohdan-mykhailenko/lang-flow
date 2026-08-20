---
name: worktrees
description: Manage the repository's 3 parallel git worktree workspaces (lang-flow, lang-flow-1, lang-flow-2) for concurrent agent execution with zero branch or port collisions.
---

# Parallel Git Worktrees Architecture

The repository operates across 3 linked git worktrees:
- `C:/Users/bamyk/Repositories/personal/lang-flow` (Workspace 0 / Orchestrator)
- `C:/Users/bamyk/Repositories/personal/lang-flow-1` (Workspace 1 / Agent 1)
- `C:/Users/bamyk/Repositories/personal/lang-flow-2` (Workspace 2 / Agent 2)

```
git worktree list
```

---

## 🔌 Fixed Port Assignments

| Workspace | Working Directory | Axum API (`PORT`) | Web App (`PORT`) |
| :--- | :--- | :--- | :--- |
| **Workspace 0** | `lang-flow` | `8080` | `3000` |
| **Workspace 1** | `lang-flow-1` | `8081` | `3001` |
| **Workspace 2** | `lang-flow-2` | `8082` | `3002` |

---

## 🔄 Agent Worktree Execution Loop

1. **Pick an Idle Workspace**: Confirm workspace is on `(detached HEAD)` at `origin/main`.
2. **Checkout Feature Branch**: `git checkout -b feat/story-<ID>`
3. **Execute Implementation**: Deliver code, schemas, and tests following `/delivery-loop`.
4. **Verify**: Run `pnpm typecheck && pnpm lint && pnpm test`.
5. **Commit & Push**: Push branch to GitHub, open PR, and link to GitHub Issue.
6. **Release Workspace**: `git checkout --detach origin/main` to leave the worktree ready for the next task.
