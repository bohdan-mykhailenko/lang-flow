export type PartOfSpeech =
  | 'noun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'idiom'
  | 'particle'
  | 'preposition';

export type EtymologyType =
  | 'slavic_cognate'
  | 'false_friend'
  | 'loanword_ottoman'
  | 'loanword_french'
  | 'loanword_german'
  | 'loanword_english'
  | 'native';

export type SupportedLanguage = 'bg' | 'pl' | 'fr';

export interface Document {
  id: number;
  title: string;
  content: string;
  sourceType: 'vtt' | 'notebooklm' | 'manual' | 'gdrive';
  language: SupportedLanguage;
  createdAt: string;
  updatedAt: string;
}

export interface VocabularyItem {
  id: number;
  documentId: number;
  targetPhrase: string;
  partOfSpeech: PartOfSpeech;
  aspectPair?: string | null;
  translationUk: string;
  contextSentence: string;
  sentenceTranslationUk?: string | null;
  etymologyType: EtymologyType;
  etymologyNotes?: string | null;
  grammarNotes?: string | null;
  createdAt: string;
}
