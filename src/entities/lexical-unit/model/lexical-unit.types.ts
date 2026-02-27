export type BlobType = Blob | null;
export type LexicalUnitType = 'word' | 'expression';
export type Url = string | null
export type PartsOfSpeech =
  | 'noun'
  | 'pronoun'
  | 'verb'
  | 'adjective'
  | 'adverb'
  | 'preposition'
  | 'conjunction'
  | 'interjunction'
  | 'article'
  | 'numeral'
  | 'particle';

export interface LexicalUnit {
  id: string;
  type: LexicalUnitType;
  value: string;
  translation?: string;
  transcription?: string;
  meaning?: string;
  antonyms?: string[] | null;
  synonyms?: string[] | null;
  partsOfSpeech?: PartsOfSpeech[] | null;
  examples?: string[] | null;
  comment?: string;
  audioUrl?: Url;
  imageUrl?: Url;
}

export interface LexicalUnitSuggestion {
  id: string;
  type: LexicalUnitType;
  value: string;
  translation: string | null;
  transcription: string | null;
}

export interface AddLexicalUnitFormValues {
  type: LexicalUnitType;
  value: string;
  translation?: string;
  transcription?: string;
  meaning?: string;
  antonyms?: string[] | null;
  synonyms?: string[] | null;
  partsOfSpeech?: PartsOfSpeech[];
  examples?: string[] | null;
  comment?: string;
  audio?: BlobType;
  imageUrl?: string;
}
