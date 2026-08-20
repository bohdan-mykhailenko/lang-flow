# AI & Model Context Protocol (MCP) Standards

## 1. Zero Hallucination & Strict Schema Pipeline

To ensure 100% deterministic parsing of raw transcripts into flashcards, we enforce strict JSON Schemas (`responseSchema`) with Google Gemini.

### Vocabulary Extraction JSON Schema Contract

```json
{
  "type": "object",
  "properties": {
    "document_summary": { "type": "string" },
    "language": { "type": "string", "enum": ["bg", "pl", "fr"] },
    "vocabulary_items": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "target_phrase": {
            "type": "string",
            "description": "Bulgarian lemma or phrase"
          },
          "part_of_speech": {
            "type": "string",
            "enum": ["noun", "verb", "adjective", "adverb", "idiom", "particle"]
          },
          "aspect_pair": {
            "type": "string",
            "description": "Imperfective/perfective pair if verb"
          },
          "translation_uk": {
            "type": "string",
            "description": "Accurate Ukrainian translation in this context"
          },
          "context_sentence": {
            "type": "string",
            "description": "Exact sentence extracted from source text"
          },
          "sentence_translation_uk": {
            "type": "string",
            "description": "Ukrainian translation of the sentence"
          },
          "etymology_type": {
            "type": "string",
            "enum": [
              "slavic_cognate",
              "false_friend",
              "loanword_ottoman",
              "loanword_french",
              "native"
            ]
          },
          "etymology_notes": {
            "type": "string",
            "description": "Cognates or false friend warnings"
          },
          "grammar_notes": {
            "type": "string",
            "description": "Definite article form, plural, or preposition government"
          }
        },
        "required": [
          "target_phrase",
          "part_of_speech",
          "translation_uk",
          "context_sentence",
          "etymology_type"
        ]
      }
    }
  },
  "required": ["document_summary", "language", "vocabulary_items"]
}
```

---

## 2. Model Context Protocol (MCP) Architecture

LangFlow exposes an **MCP Server** (`crates/mcp-server`) that implements the official Model Context Protocol. This enables Google Antigravity, Claude, and internal conversational tutors to call domain tools deterministically.

### Core MCP Tools Exposed:

| Tool Name            | Parameters                                                                              | Description                                                                                         |
| :------------------- | :-------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------- |
| `search_library`     | `query: string`, `limit?: number`                                                       | Performs sub-millisecond PostgreSQL `tsvector` search across all ingested documents and vocabulary. |
| `create_flashcard`   | `target_phrase: string`, `translation: string`, `context: string`, `etymology?: string` | Creates and commits a new card with initial FSRS scheduling parameters into Neon DB.                |
| `get_due_cards`      | `deck?: string`, `limit?: number`                                                       | Returns the list of cards currently due for active recall review.                                   |
| `record_card_review` | `card_id: i64`, `rating: 1-4`                                                           | Updates card FSRS stability, difficulty, review count, and schedules the next review timestamp.     |
| `ingest_raw_text`    | `title: string`, `content: string`, `source_type: string`                               | Triggers the Gemini extraction pipeline on a new text transcript and saves cards.                   |

---

## 3. Database-Aware AI Tutor Protocol

When chatting with the in-app tutor:

1. The user message is sent to Gemini with function declarations matching the MCP/database tools.
2. If the user asks: _"Where did I see the word 'въпреки'?"_, Gemini calls `search_library(query: "въпреки")`.
3. The backend executes the Postgres `tsvector` query, returns the matching excerpts to Gemini, and Gemini summarizes the exact real contexts.
4. If the user asks: _"Add 2 collocations for 'свиквам' to my deck"_, Gemini calls `create_flashcard(...)` and immediately confirms creation to the user.
