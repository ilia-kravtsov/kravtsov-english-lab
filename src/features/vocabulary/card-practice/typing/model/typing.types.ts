import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';

export type TypingFeedback = 'idle' | 'correct' | 'wrong';

export type TypingCardStat = {
  cardId: string;
  lexicalUnitId: string;
  attempts: number;
  wrongCount: number;
  timeMs: number;
  isCorrect?: boolean;
  skipped?: boolean;
};

export type TypingSessionCard = CardWithLexicalUnit & {
  lexicalUnit: NonNullable<CardWithLexicalUnit['lexicalUnit']>;
};