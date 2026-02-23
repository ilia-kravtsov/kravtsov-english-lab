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
  antonyms?: string;
  synonyms?: string;
  partsOfSpeech?: PartsOfSpeech[] | null;
  examples?: string;
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
  antonyms?: string;
  synonyms?: string;
  partsOfSpeech?: PartsOfSpeech[];
  examples?: string;
  comment?: string;
  audio?: BlobType;
  imageUrl?: string;
}
