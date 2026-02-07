import type {
  LexicalUnitType,
  PartsOfSpeech,
} from '@/entities/lexical-unit/model/lexical-unit.types.ts';

export interface AddLexicalUnitFormValues {
  type: LexicalUnitType;
  value: string;
  transcription: string;
  meaning: string;
  antonyms: string;
  synonyms: string;
  partsOfSpeech: PartsOfSpeech | '';
  examples: string;
  comment: string;
  audio?: Blob | null;
}
