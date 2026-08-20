use db::DbPool;
use serde::{Deserialize, Serialize};
use serde_json::Value;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ToolDefinition {
    pub name: String,
    pub description: String,
    pub input_schema: Value,
}

pub struct LangFlowMcp {
    pub pool: DbPool,
}

impl LangFlowMcp {
    pub fn new(pool: DbPool) -> Self {
        Self { pool }
    }

    pub fn list_tools(&self) -> Vec<ToolDefinition> {
        vec![
            ToolDefinition {
                name: "search_library".to_string(),
                description: "Search ingested documents and vocabulary using PostgreSQL tsvector Slavic root matching".to_string(),
                input_schema: serde_json::json!({
                    "type": "object",
                    "properties": {
                        "query": { "type": "string", "description": "Search keyword or lemma" },
                        "limit": { "type": "integer", "default": 10 }
                    },
                    "required": ["query"]
                }),
            },
            ToolDefinition {
                name: "create_flashcard".to_string(),
                description: "Create and immediately schedule a new active recall flashcard in the database".to_string(),
                input_schema: serde_json::json!({
                    "type": "object",
                    "properties": {
                        "target_phrase": { "type": "string" },
                        "translation_uk": { "type": "string" },
                        "context_sentence": { "type": "string" },
                        "part_of_speech": { "type": "string", "default": "verb" },
                        "etymology_notes": { "type": "string" }
                    },
                    "required": ["target_phrase", "translation_uk", "context_sentence"]
                }),
            },
            ToolDefinition {
                name: "get_due_cards".to_string(),
                description: "Retrieve active cards currently due for FSRS review".to_string(),
                input_schema: serde_json::json!({
                    "type": "object",
                    "properties": {
                        "limit": { "type": "integer", "default": 20 }
                    }
                }),
            }
        ]
    }
}
