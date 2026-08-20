use regex::Regex;

/// Clean and extract plain dialogue text from .vtt subtitle transcripts or markdown notes
pub fn parse_raw_transcript(content: &str, source_type: &str) -> String {
    match source_type.to_lowercase().as_str() {
        "vtt" => parse_vtt(content),
        "markdown" | "md" => parse_markdown(content),
        _ => content.trim().to_string(),
    }
}

/// Strip WebVTT header, timestamps, cue identifiers, and HTML styling tags
fn parse_vtt(content: &str) -> String {
    let mut cleaned_lines = Vec::new();
    let timestamp_regex = Regex::new(r"^\d{2}:\d{2}(:\d{2})?\.\d{3}\s*-->\s*\d{2}:\d{2}(:\d{2})?\.\d{3}").unwrap();
    let tag_regex = Regex::new(r"<[^>]+>").unwrap();

    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty()
            || trimmed.starts_with("WEBVTT")
            || trimmed.starts_with("NOTE")
            || trimmed.starts_with("STYLE")
            || timestamp_regex.is_match(trimmed)
            || trimmed.chars().all(|c| c.is_ascii_digit())
        {
            continue;
        }

        let without_tags = tag_regex.replace_all(trimmed, "").to_string();
        if !without_tags.is_empty() && !cleaned_lines.contains(&without_tags) {
            cleaned_lines.push(without_tags);
        }
    }

    cleaned_lines.join(" ")
}

/// Strip markdown formatting while preserving structural sentences
fn parse_markdown(content: &str) -> String {
    let link_regex = Regex::new(r"\[([^\]]+)\]\([^\)]+\)").unwrap();
    let header_regex = Regex::new(r"^#+\s*").unwrap();

    let mut result = Vec::new();
    for line in content.lines() {
        let trimmed = line.trim();
        if trimmed.is_empty() {
            continue;
        }
        let without_headers = header_regex.replace(trimmed, "");
        let without_links = link_regex.replace_all(&without_headers, "$1");
        result.push(without_links.to_string());
    }

    result.join("\n")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_vtt_parsing() {
        let vtt = r#"WEBVTT
Kind: captions
Language: bg

00:00:01.000 --> 00:00:03.500
Здравейте на всички! Днес ще говорим за езика.

00:00:03.600 --> 00:00:06.000
Трябваше ми доста време да <b>свикна</b> с новия ритъм.
"#;
        let parsed = parse_vtt(vtt);
        assert!(parsed.contains("Здравейте на всички!"));
        assert!(parsed.contains("свикна"));
        assert!(!parsed.contains("WEBVTT"));
        assert!(!parsed.contains("<b>"));
    }

    #[test]
    fn test_markdown_parsing() {
        let md = "# Урок 1\n\nТова е [линк](https://example.com) за упражнение.";
        let parsed = parse_markdown(md);
        assert_eq!(parsed, "Урок 1\nТова е линк за упражнение.");
    }
}
