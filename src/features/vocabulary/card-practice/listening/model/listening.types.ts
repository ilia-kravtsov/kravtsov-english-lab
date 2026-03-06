import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';

export type ListeningFeedback = 'idle' | 'correct' | 'wrong';

export type ListeningCardStat = {
  cardId: string;
  lexicalUnitId: string;
  attempts: number;
  wrongCount: number;
  timeMs: number;
  isCorrect?: boolean;
  skipped?: boolean;
};

export type ListeningSessionCard = CardWithLexicalUnit & {
  lexicalUnit: NonNullable<CardWithLexicalUnit['lexicalUnit']>;
};