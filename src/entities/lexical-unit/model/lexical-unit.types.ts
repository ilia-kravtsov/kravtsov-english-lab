export type BlobType = Blob | null;
export type LexicalUnitType = 'word' | 'expression';
export type StringOrNull = string | null;
export type StringArrayOrNull = string[] | null;
type PartsOfSpeechOrNull = PartsOfSpeech[] | null;
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
  antonyms?: StringArrayOrNull;
  synonyms?: StringArrayOrNull;
  partsOfSpeech?: PartsOfSpeechOrNull;
  examples?: StringArrayOrNull;
  comment?: string;
  audioUrl?: StringOrNull;
  imageUrl?: StringOrNull;
  soundMeaningUrl?: StringOrNull;
  soundExampleUrl?: StringOrNull;
}

export interface LexicalUnitSuggestion {
  id: string;
  type: LexicalUnitType;
  value: string;
  translation: StringOrNull;
  transcription: StringOrNull;
}

export interface AddLexicalUnitFormValues {
  type: LexicalUnitType;
  value: string;
  translation?: string;
  transcription?: string;
  meaning?: string;
  antonyms?: StringArrayOrNull;
  synonyms?: StringArrayOrNull;
  partsOfSpeech?: PartsOfSpeech[];
  examples?: StringArrayOrNull;
  comment?: string;
  audio?: BlobType;
  soundMeaning?: BlobType;
  soundExample?: BlobType;
  imageUrl?: string;
}
