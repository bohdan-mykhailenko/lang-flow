# Rule: No Fallback Crutches & Direct Target Integration From Day 1

## Core Principle

We do **not** build temporary fallback layers, mock crutches, or compromise solutions (such as relying on LocalStorage when cloud storage is requested). We architect and integrate directly towards the final target solution from Day 1.

## Rules

1. **Target Architecture Directness**:
   - If the architecture choice is Firebase Firestore, integrate the real Firebase SDK and Firestore database directly from Day 1.
   - Do not hide or silence failures behind silent fallback crutches.
2. **Strict Environment Configuration**:
   - Provide clear, typed `.env` and `.env.example` configurations.
   - Initialize and export target client instances (`db = getFirestore(app)`).
3. **Deterministic Persistence**:
   - Document operations write directly to target Firestore collections (`topic_progressions`).
   - Any read/write operation is fully typed and handled via standard Firestore promises.
