use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum PartOfSpeech {
    Noun,
    Verb,
    Adjective,
    Adverb,
    Idiom,
    Particle,
    Preposition,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "snake_case")]
pub enum EtymologyType {
    SlavicCognate,
    FalseFriend,
    LoanwordOttoman,
    LoanwordFrench,
    LoanwordGerman,
    LoanwordEnglish,
    Native,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Document {
    pub id: i64,
    pub title: string_or_empty::StringOrEmpty,
    pub content: String,
    pub source_type: String,
    pub language: String,
    pub created_at: DateTime<Utc>,
}

mod string_or_empty {
    pub type StringOrEmpty = String;
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct VocabularyItem {
    pub id: i64,
    pub document_id: Option<i64>,
    pub target_phrase: String,
    pub part_of_speech: PartOfSpeech,
    pub aspect_pair: Option<String>,
    pub translation_uk: String,
    pub context_sentence: String,
    pub sentence_translation_uk: Option<String>,
    pub etymology_type: EtymologyType,
    pub etymology_notes: Option<String>,
    pub grammar_notes: Option<String>,
    pub created_at: DateTime<Utc>,
}
