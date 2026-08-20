---
name: qa-bugs
description: Procedure for filing, isolating, and verifying bug fixes found during testing sessions.
---

# QA Bug Playbook

1. **Bug Identification**:
   - File a GitHub issue using `.github/ISSUE_TEMPLATE/bug.yml` (`type: bug`).
   - Add reproduction steps, expected vs actual behavior, and affected crate/package.
2. **Isolation & Branching**:
   - Create fix branch: `fix/issue-<ID>`.
   - Write a failing test reproducing the defect.
3. **Remediation & Self-Audit**:
   - Implement the fix and verify that the test passes.
   - Run pre-commit checks (`pnpm typecheck`, `pnpm lint`, `pnpm test`).
   - Submit PR with `Closes #<ID>`.
