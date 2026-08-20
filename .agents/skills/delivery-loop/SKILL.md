---
name: delivery-loop
description: The mandatory 4-stage delivery procedure (Plan → Implement → Verify → Post-Audit) for every feature, sub-issue, or bug fix.
---

# Delivery Loop Playbook

Follow this strictly ordered cycle for every implementation task:

## 1. Plan (`plans/<FEATURE-ID>.md`)

- Scope definition and requirement tracing (cite `specs/requirements/` section).
- Check existing workspace code and reuse before adding new components.
- Design data flow and contracts (no implementation code snippets in the plan).

## 2. Implement

- Write typed, deterministic code with strict schema conformance.
- Ensure no placeholder components or stubbed functions remain.

## 3. Verify

- Run `pnpm typecheck` and `pnpm lint`.
- Run `cargo check`, `cargo clippy -- -D warnings`, `cargo test`.
- Run `pnpm lint:deps` (Syncpack).

## 4. Post-Implementation Audit

- Check against acceptance criteria and UI ergonomics.
- Fix all deviations before finalizing.
- Delete working plan file in `plans/` when merging.
