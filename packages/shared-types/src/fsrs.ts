export type FSRSRating = 1 | 2 | 3 | 4; // 1: Again, 2: Hard, 3: Good, 4: Easy

export type FSRSState = 'New' | 'Learning' | 'Review' | 'Relearning';

export interface FSRSCard {
  id: number;
  vocabularyId: number;
  stability: number;
  difficulty: number;
  repetitions: number;
  lapses: number;
  state: FSRSState;
  lastReview?: string | null;
  due: string;
  createdAt: string;
}

export interface ReviewLog {
  id: number;
  cardId: number;
  rating: FSRSRating;
  state: FSRSState;
  due: string;
  stability: number;
  difficulty: number;
  reviewedAt: string;
  reviewDurationMs?: number;
}

export interface DueReviewItem {
  card: FSRSCard;
  vocabulary: import('./vocabulary.js').VocabularyItem;
}
