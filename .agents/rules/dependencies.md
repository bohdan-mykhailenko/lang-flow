# Dependency Governance & Sync Rules

- **Approval Gate**: Propose third-party packages before adding. Prefer existing workspace primitives (Chakra UI v3, TanStack, Axum/Tokio).
- **Version Synchronization**: Enforce identical versions across all packages using Syncpack (`pnpm lint:deps`).
- **Workspace Packages**: Internal packages must be pinned using `workspace:*`.
