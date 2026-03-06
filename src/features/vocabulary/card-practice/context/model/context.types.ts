import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';

export type ContextFeedback = 'idle' | 'correct' | 'wrong';

export type ContextCardStat = {
  cardId: string;
  lexicalUnitId: string;
  attempts: number;
  wrongCount: number;
  timeMs: number;
  isCorrect?: boolean;
  skipped?: boolean;
};

export type ContextSessionCard = CardWithLexicalUnit & {
  lexicalUnit: NonNullable<CardWithLexicalUnit['lexicalUnit']>;
  contextExample: string;
  contextMasked: string;
};
