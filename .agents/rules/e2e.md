# End-to-End (E2E) & Integration Testing Standards

## 1. Principles

- **Verify Behavior, Not Implementation**: E2E tests validate real learner flows (e.g. uploading a transcript, flipping flashcards, rating retention, receiving audio pronunciation).
- **Zero Faked Passes**: Any test that cannot be reliably asserted must carry an explicit reason.

---

## 2. Core User Flows to Cover

1. **Ingestion Flow**: Drop `.vtt` file → Gemini parsing → Cards populated in database.
2. **Daily Review Flow**: Open study deck → Trigger TTS (`Space`) → Grade retention (`1-4`) → FSRS interval progression recalculated.
3. **Conversational Tutor Flow**: In-app chat query → Gemini function calling (`search_library`) → Root matches returned with source citations.
