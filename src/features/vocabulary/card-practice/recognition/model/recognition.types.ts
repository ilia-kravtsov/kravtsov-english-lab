import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';

export type RecognitionFeedback = 'idle' | 'correct' | 'wrong';

export type RecognitionCardStat = {
  cardId: string;
  lexicalUnitId: string;
  attempts: number;
  wrongCount: number;
  timeMs: number;
};

export type RecognitionSessionCard = CardWithLexicalUnit & {
  lexicalUnit: NonNullable<CardWithLexicalUnit['lexicalUnit']>;
};