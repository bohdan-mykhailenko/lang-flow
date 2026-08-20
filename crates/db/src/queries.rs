use core::{AppError, Card, Rating, ReviewRecord, VocabularyItem};
use sqlx::PgPool;
use chrono::Utc;

pub async fn fetch_due_cards(pool: &PgPool, limit: i64) -> Result<Vec<Card>, AppError> {
    let now = Utc::now();
    let records = sqlx::query_as!(
        CardDbRecord,
        r#"
        SELECT id, vocabulary_id, stability, difficulty, repetitions, lapses, state, last_review, due, created_at
        FROM fsrs_cards
        WHERE due <= $1
        ORDER BY due ASC
        LIMIT $2
        "#,
        now,
        limit
    )
    .fetch_all(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(records.into_iter().map(Into::into).collect())
}

pub async fn save_card_review(
    pool: &PgPool,
    card_id: i64,
    rating: Rating,
) -> Result<ReviewRecord, AppError> {
    let mut card = fetch_card_by_id(pool, card_id).await?;
    let now = Utc::now();
    let record = card.schedule_next(rating, now);

    let state_str = format!("{:?}", card.state);

    sqlx::query!(
        r#"
        UPDATE fsrs_cards
        SET stability = $1, difficulty = $2, repetitions = $3, lapses = $4, state = $5, last_review = $6, due = $7
        WHERE id = $8
        "#,
        card.stability,
        card.difficulty,
        card.repetitions,
        card.lapses,
        state_str,
        card.last_review,
        card.due,
        card.id
    )
    .execute(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?;

    Ok(record)
}

async fn fetch_card_by_id(pool: &PgPool, id: i64) -> Result<Card, AppError> {
    let record = sqlx::query_as!(
        CardDbRecord,
        r#"
        SELECT id, vocabulary_id, stability, difficulty, repetitions, lapses, state, last_review, due, created_at
        FROM fsrs_cards
        WHERE id = $1
        "#,
        id
    )
    .fetch_optional(pool)
    .await
    .map_err(|e| AppError::Database(e.to_string()))?
    .ok_or_else(|| AppError::NotFound(format!("Card with id {id} not found")))?;

    Ok(record.into())
}

struct CardDbRecord {
    pub id: i64,
    pub vocabulary_id: i64,
    pub stability: f64,
    pub difficulty: f64,
    pub repetitions: i32,
    pub lapses: i32,
    pub state: String,
    pub last_review: Option<chrono::DateTime<Utc>>,
    pub due: chrono::DateTime<Utc>,
    pub created_at: chrono::DateTime<Utc>,
}

impl From<CardDbRecord> for Card {
    fn from(r: CardDbRecord) -> Self {
        let state = match r.state.as_str() {
            "Learning" => core::CardState::Learning,
            "Review" => core::CardState::Review,
            "Relearning" => core::CardState::Relearning,
            _ => core::CardState::New,
        };

        Self {
            id: r.id,
            vocabulary_id: r.vocabulary_id,
            stability: r.stability,
            difficulty: r.difficulty,
            repetitions: r.repetitions,
            lapses: r.lapses,
            state,
            last_review: r.last_review,
            due: r.due,
            created_at: r.created_at,
        }
    }
}
