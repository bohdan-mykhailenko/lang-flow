---
name: qa-story
description: Procedure for running post-implementation QA verification and validating acceptance criteria before closing issues.
---

# QA Story Verification

1. **Verify Functional Paths**:
   - Run active card study loop (keyboard shortcuts 1-4, flip, TTS playback).
   - Test document ingestion and Gemini JSON schema parsing.
   - Test lexical full-text search against Bulgarian roots.
2. **Audit Edge Cases**:
   - Empty review decks.
   - Network failure handling for AI and audio endpoints.
3. **Sign-off**:
   - Confirm all items in the story acceptance checklist are green.
