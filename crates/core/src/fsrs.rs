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

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ReviewRecord {
    pub card_id: i64,
    pub rating: Rating,
    pub previous_stability: f64,
    pub previous_difficulty: f64,
    pub new_stability: f64,
    pub new_difficulty: f64,
    pub reviewed_at: DateTime<Utc>,
    pub next_due: DateTime<Utc>,
}

impl Card {
    pub fn new(id: i64, vocabulary_id: i64) -> Self {
        let now = Utc::now();
        Self {
            id,
            vocabulary_id,
            stability: 0.0,
            difficulty: 5.0,
            repetitions: 0,
            lapses: 0,
            state: CardState::New,
            last_review: None,
            due: now,
            created_at: now,
        }
    }

    /// Free Spaced Repetition Scheduler (FSRS) formulation
    pub fn schedule_next(&mut self, rating: Rating, now: DateTime<Utc>) -> ReviewRecord {
        let prev_s = self.stability;
        let prev_d = self.difficulty;

        match rating {
            Rating::Again => {
                self.lapses += 1;
                self.stability = (self.stability * 0.4).max(0.1);
                self.difficulty = (self.difficulty + 0.3).min(10.0);
                self.state = CardState::Relearning;
                self.due = now + Duration::minutes(10);
            }
            Rating::Hard => {
                self.stability = if self.stability <= 0.0 {
                    1.2
                } else {
                    (self.stability * 1.3).max(1.0)
                };
                self.difficulty = (self.difficulty + 0.15).min(10.0);
                self.repetitions += 1;
                self.state = CardState::Review;
                let days = self.stability.round() as i64;
                self.due = now + Duration::days(days.max(1));
            }
            Rating::Good => {
                self.stability = if self.stability <= 0.0 {
                    2.8
                } else {
                    self.stability * 2.2
                };
                self.repetitions += 1;
                self.state = CardState::Review;
                let days = self.stability.round() as i64;
                self.due = now + Duration::days(days.max(1));
            }
            Rating::Easy => {
                self.stability = if self.stability <= 0.0 {
                    5.5
                } else {
                    self.stability * 3.6
                };
                self.difficulty = (self.difficulty - 0.2).max(1.0);
                self.repetitions += 1;
                self.state = CardState::Review;
                let days = self.stability.round() as i64;
                self.due = now + Duration::days(days.max(3));
            }
        }

        self.last_review = Some(now);

        ReviewRecord {
            card_id: self.id,
            rating,
            previous_stability: prev_s,
            previous_difficulty: prev_d,
            new_stability: self.stability,
            new_difficulty: self.difficulty,
            reviewed_at: now,
            next_due: self.due,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_initial_card_creation() {
        let card = Card::new(1, 100);
        assert_eq!(card.repetitions, 0);
        assert_eq!(card.lapses, 0);
        assert_eq!(card.state, CardState::New);
    }

    #[test]
    fn test_rating_again_triggers_lapse() {
        let mut card = Card::new(1, 100);
        let now = Utc::now();
        let record = card.schedule_next(Rating::Again, now);

        assert_eq!(card.lapses, 1);
        assert_eq!(card.state, CardState::Relearning);
        assert_eq!(record.rating, Rating::Again);
        assert!(card.due > now);
    }

    #[test]
    fn test_rating_good_increases_stability() {
        let mut card = Card::new(1, 100);
        let now = Utc::now();
        card.schedule_next(Rating::Good, now);
        assert!(card.stability >= 2.8);
        assert_eq!(card.repetitions, 1);
        assert_eq!(card.state, CardState::Review);
    }

    #[test]
    fn test_difficulty_bounds() {
        let mut card = Card::new(1, 100);
        let now = Utc::now();
        for _ in 0..50 {
            card.schedule_next(Rating::Easy, now);
        }
        assert!(card.difficulty >= 1.0);
        assert!(card.difficulty <= 10.0);
    }
}
