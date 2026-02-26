import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';

export type TypingFeedback = 'idle' | 'correct' | 'wrong';

export type TypingCardStat = {
  cardId: string;
  lexicalUnitId: string;
  attempts: number;
  wrongCount: number;
  timeMs: number;
};

export type TypingStats = {
  totalCards: number;
  completedCards: number;
  correctCards: number;
  accuracy: number;
  avgTimeMs: number;
  updatedAt: string;
  byCard: Record<string, TypingCardStat>;
};

export type PracticeStats = {
  recognition?: unknown;
  typing?: TypingStats;
  listening?: unknown;
  context?: unknown;
};

export type TypingSessionCard = CardWithLexicalUnit & {
  lexicalUnit: NonNullable<CardWithLexicalUnit['lexicalUnit']>;
};