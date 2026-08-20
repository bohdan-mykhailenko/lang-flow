# 🤖 Model Context Protocol (MCP)

LangFlow implements the **Model Context Protocol (MCP)** specification, exposing core language learning actions as typed tools for AI models.

---

## 🛠️ Exposed MCP Tools

```json
[
  {
    "name": "search_library",
    "description": "Performs lexical full-text search across ingested transcripts using PostgreSQL tsvector.",
    "input_schema": {
      "type": "object",
      "properties": {
        "query": { "type": "string" },
        "limit": { "type": "integer", "default": 10 }
      },
      "required": ["query"]
    }
  },
  {
    "name": "create_flashcard",
    "description": "Generates and commits a new active recall flashcard into Neon PostgreSQL with initial FSRS scheduling.",
    "input_schema": {
      "type": "object",
      "properties": {
        "target_phrase": { "type": "string" },
        "translation_uk": { "type": "string" },
        "context_sentence": { "type": "string" },
        "part_of_speech": { "type": "string" }
      },
      "required": ["target_phrase", "translation_uk", "context_sentence"]
    }
  },
  {
    "name": "get_due_cards",
    "description": "Returns pending cards scheduled for active recall review."
  }
]
```

---

## 💬 Conversational Tutor Integration

The in-app AI tutor directly invokes these tools during dialogue:
- *"Where did I encounter 'въпреки'?"* → Calls `search_library("въпреки")` and references authentic transcript timestamps.
- *"Add 3 collocations with 'свиквам' to my deck"* → Calls `create_flashcard(...)` and immediately schedules them for review.
