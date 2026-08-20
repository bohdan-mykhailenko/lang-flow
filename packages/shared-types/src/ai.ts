import type {
  EtymologyType,
  PartOfSpeech,
  SupportedLanguage,
} from './vocabulary.js';

export interface ExtractedVocabularyItem {
  targetPhrase: string;
  partOfSpeech: PartOfSpeech;
  aspectPair?: string;
  translationUk: string;
  contextSentence: string;
  sentenceTranslationUk?: string;
  etymologyType: EtymologyType;
  etymologyNotes?: string;
  grammarNotes?: string;
}

export interface IngestionExtractionResponse {
  documentSummary: string;
  language: SupportedLanguage;
  vocabularyItems: ExtractedVocabularyItem[];
}

export interface TutorChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  toolCalls?: Array<{
    toolName: string;
    arguments: Record<string, unknown>;
    result?: unknown;
  }>;
  createdAt: string;
}
