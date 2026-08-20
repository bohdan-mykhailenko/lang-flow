use crate::schema::IngestionExtractionResult;
use core::AppError;
use reqwest::Client;
use serde_json::json;

#[derive(Clone)]
pub struct GeminiClient {
    api_key: String,
    model: String,
    http: Client,
}

impl GeminiClient {
    pub fn new(api_key: String) -> Self {
        Self {
            api_key,
            model: "gemini-1.5-flash".to_string(),
            http: Client::new(),
        }
    }

    pub async fn extract_vocabulary(
        &self,
        text: &str,
        source_language: &str,
    ) -> Result<IngestionExtractionResult, AppError> {
        let url = format!(
            "https://generativelanguage.googleapis.com/v1beta/models/{}:generateContent?key={}",
            self.model, self.api_key
        );

        let system_instruction = format!(
            "You are a linguistic expert specializing in Slavic language acquisition ({source_language} to Ukrainian). \
            Extract 15-30 key vocabulary items, collocations, aspect pairs, and etymological cognates from the provided text."
        );

        let body = json!({
            "system_instruction": {
                "parts": [{ "text": system_instruction }]
            },
            "contents": [{
                "parts": [{ "text": text }]
            }],
            "generationConfig": {
                "response_mime_type": "application/json"
            }
        });

        let resp = self
            .http
            .post(&url)
            .json(&body)
            .send()
            .await
            .map_err(|e| AppError::AiExtraction(e.to_string()))?;

        if !resp.status().is_success() {
            let error_text = resp.text().await.unwrap_or_default();
            return Err(AppError::AiExtraction(format!(
                "Gemini API returned error: {error_text}"
            )));
        }

        let json_resp: serde_json::Value = resp
            .json()
            .await
            .map_err(|e| AppError::AiExtraction(e.to_string()))?;

        let candidate_text = json_resp["candidates"][0]["content"]["parts"][0]["text"]
            .as_str()
            .ok_or_else(|| AppError::AiExtraction("Missing text in Gemini response".to_string()))?;

        let parsed: IngestionExtractionResult = serde_json::from_str(candidate_text)
            .map_err(|e| AppError::AiExtraction(format!("JSON schema parse error: {e}")))?;

        Ok(parsed)
    }
}
