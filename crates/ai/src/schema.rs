use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ExtractedItem {
    pub target_phrase: String,
    pub part_of_speech: String,
    pub aspect_pair: Option<String>,
    pub translation_uk: String,
    pub context_sentence: String,
    pub sentence_translation_uk: Option<String>,
    pub etymology_type: String,
    pub etymology_notes: Option<String>,
    pub grammar_notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct IngestionExtractionResult {
    pub document_summary: String,
    pub language: String,
    pub vocabulary_items: Vec<ExtractedItem>,
}
