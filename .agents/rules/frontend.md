# Frontend & React Rules

- **Framework**: Vite + React 19 + Chakra UI v3 + TanStack Query/Router.
- **Design System**: Use Chakra UI v3 semantic tokens and compound components (`Dialog.Root`, `Field.Root`, etc.). Never hardcode raw hex colors in style props.
- **Type Safety**: Strictly consume `@lang-flow/shared-types`. No `any` types permitted.
- **Accessibility & UX**: All interactive elements must support keyboard navigation (1-4 shortcuts for FSRS ratings, Space for TTS/flip).
