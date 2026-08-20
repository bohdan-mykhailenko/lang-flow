# Frontend & React Standards

## 1. Core Framework & Philosophy

- **Framework**: React 18+ / 19 with **TanStack Start / Router** and Vite for type-safe routing and fast SSR/CSR.
- **Component Library**: **Chakra UI v3** (using Chakra compound components and snippet recipes).
- **Language**: Strict TypeScript (`"strict": true`, no `any`, explicit return types for hooks/services).
- **Server State & Caching**: **TanStack Query (React Query)** for data fetching, caching, and optimistic mutations.

---

## 2. Chakra UI v3 Best Practices

Chakra UI v3 uses a snippet and compound component model (`@chakra-ui/react`):

1. **Theme Tokens**: Never hardcode hex color strings in component styles. Always use semantic tokens (e.g. `bg="bg.muted"`, `color="fg.subtle"`, `borderColor="border.subtle"`).
2. **Compound Components**: Use subcomponents for accessible composition (e.g., `<Dialog.Root>`, `<Dialog.Trigger>`, `<Dialog.Content>`).
3. **Recipes & Variants**: Define reusable component variants using the Chakra v3 recipe API rather than spreading ad-hoc styles.
4. **Dark Mode First**: Support both dark and light modes, with a sleek, high-contrast dark theme as the default aesthetic.

---

## 3. Directory Layout (`apps/web/src`)

```
apps/web/src/
├── app/                        # TanStack Router routes & pages
│   ├── routes/
│   │   ├── __root.tsx          # Root layout with ChakraProvider & Navbar
│   │   ├── index.tsx           # Dashboard & metrics overview
│   │   ├── review.tsx          # Active-recall flashcard study session
│   │   ├── library.tsx         # Ingested documents & full-text search
│   │   ├── vocabulary.tsx      # Filterable vocabulary bank & etymology
│   │   └── tutor.tsx           # Agentic AI tutor chat interface
├── components/                 # Reusable UI components
│   ├── ui/                     # Chakra UI snippets (provider, button, dialog, etc.)
│   ├── flashcard/              # Flashcard flip container, ratings, audio trigger
│   ├── ingestion/              # Drag-and-drop dropzone, paste modal, progress bar
│   ├── chat/                   # Tutor message bubbles, tool call indicators
│   └── layout/                 # AppShell, Navigation, TopBar
├── hooks/                      # Custom hooks (useFSRSRating, useTTS, useAudioCache)
├── services/                   # API client functions with TanStack Query hooks
├── types/                      # TypeScript definitions & API response schemas
└── lib/                        # Utilities (date formatters, audio synthesis, FSRS helpers)
```

---

## 4. State Management Rules

- **Server State**: Always use TanStack Query (`useQuery`, `useMutation`, `useQueryClient`). Handle loading, error, and empty states explicitly.
- **Local / Ephemeral State**: React `useState` / `useReducer` for UI toggles, flip states, and drag states.
- **Global UI State**: Lightweight Zustand store (if needed for global session parameters like active language filter or audio volume).

---

## 5. Active-Recall Study Ergonomics

The flashcard review interface must be optimized for friction-free study:

- **Instant Keyboard Shortcuts**:
  - `Space` / `Enter`: Flip card / Play audio.
  - `1`: Again (Failed).
  - `2`: Hard.
  - `3`: Good.
  - `4`: Easy.
- **Smooth 3D Flip Animations**: CSS 3D transforms (`transform-style: preserve-3d`, `backface-visibility: hidden`) with zero jank.
- **Pronunciation Trigger**: Audio playback using browser Web Speech API with fallback/R2 cache.
