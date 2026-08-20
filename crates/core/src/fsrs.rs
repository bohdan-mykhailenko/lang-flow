use chrono::{DateTime, Duration, Utc};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[repr(u8)]
pub enum Rating {
    Again = 1,
    Hard = 2,
    Good = 3,
    Easy = 4,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
pub enum CardState {
    New,
    Learning,
    Review,
    Relearning,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Card {
    pub id: i64,
    pub vocabulary_id: i64,
    pub stability: f64,
    pub difficulty: f64,
    pub repetitions: i32,
    pub lapses: i32,
    pub state: CardState,
    pub last_review: Option<DateTime<Utc>>,
    pub due: DateTime<Utc>,
    pub created_at: DateTime<Utc>,
}

impl Card {
    pub fn new(id: i64, vocabulary_id: i64) -> Self {
        let now = Utc::now();
        Self {
            id,
            vocabulary_id,
            stability: 0.0,
            difficulty: 0.0,
            repetitions: 0,
            lapses: 0,
            state: CardState::New,
            last_review: None,
            due: now,
            created_at: now,
        }
    }

    /// Free Spaced Repetition Scheduler (FSRS) step computation
    pub fn schedule_next(&mut self, rating: Rating, now: DateTime<Utc>) {
        match rating {
            Rating::Again => {
                self.lapses += 1;
                self.stability = (self.stability * 0.5).max(0.1);
                self.difficulty = (self.difficulty + 0.2).min(10.0);
                self.state = CardState::Relearning;
                self.due = now + Duration::minutes(10);
            }
            Rating::Hard => {
                self.stability = (self.stability * 1.2).max(1.0);
                self.difficulty = (self.difficulty + 0.1).min(10.0);
                self.repetitions += 1;
                self.state = CardState::Review;
                let days = self.stability.round() as i64;
                self.due = now + Duration::days(days.max(1));
            }
            Rating::Good => {
                self.stability = if self.stability == 0.0 { 2.5 } else { self.stability * 2.2 };
                self.repetitions += 1;
                self.state = CardState::Review;
                let days = self.stability.round() as i64;
                self.due = now + Duration::days(days.max(1));
            }
            Rating::Easy => {
                self.stability = if self.stability == 0.0 { 5.0 } else { self.stability * 3.5 };
                self.difficulty = (self.difficulty - 0.15).max(1.0);
                self.repetitions += 1;
                self.state = CardState::Review;
                let days = self.stability.round() as i64;
                self.due = now + Duration::days(days.max(3));
            }
        }
        self.last_review = Some(now);
    }
}
