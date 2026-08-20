# Code Style & Quality Standards

- **Zero Placeholders**: Never create mock buttons or stub components without complete styling and interactive state.
- **Formatting**: Prettier for TypeScript/JSON/Markdown (`pnpm format`), `cargo fmt` for Rust.
- **Linting**: ESLint flat config (`pnpm lint`), `cargo clippy -- -D warnings` for Rust.
- **Imports**: Prefer explicit named imports over barrel index cascades where possible.
