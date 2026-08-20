# Testing & QA Verification Standards

## 1. Mandatory Self-Testing & Post-Audit Policy

**Every issue and pull request must be self-tested and verified before marking ready for review.**
No PR may be submitted with placeholder tests or unverified claims.

### Mandatory Verification Gate:

1. **Unit & Mathematical Integrity**:
   - Spaced Repetition (FSRS) mathematical curves, rating interval bounds (1–10 difficulty, stability expansion, lapses) in `crates/core/src/fsrs.rs`.
   - VTT subtitle timestamp cleaning and markdown parsing in `crates/ai/src/parser.rs`.
2. **Schema & Contract Conformance**:
   - Gemini structured JSON extraction mock responses validate 100% against `crates/ai/src/schema.rs` and `@lang-flow/shared-types`.
3. **Database Integrity**:
   - `sqlx` query types, GIN `tsvector` search queries, and transactional card review mutations.
4. **Pre-Commit Checks**:
   - `npx lint-staged`
   - `pnpm lint:deps` (Syncpack: zero version mismatches)
   - `pnpm typecheck` (Strict TypeScript, no `any`, no unused identifiers)

---

## 2. Testing Worktree & QA Agent (Workspace 3: `lang-flow-3`)

- **Role**: Dedicated QA and integration agent running in `C:/Users/bamyk/Repositories/personal/lang-flow-3`.
- **Responsibilities**:
  - Independent verification of feature branches.
  - Regression testing and bug report creation (`type: bug`).
  - Integration audits between Rust backend endpoints and Chakra UI frontend components.
