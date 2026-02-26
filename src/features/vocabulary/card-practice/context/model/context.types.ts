import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';

export type ContextFeedback = 'idle' | 'correct' | 'wrong';

export type ContextCardStat = {
  cardId: string;
  lexicalUnitId: string;
  attempts: number;
  wrongCount: number;
  timeMs: number;
};

export type ContextStats = {
  totalCards: number;
  completedCards: number;
  correctCards: number;
  accuracy: number;
  avgTimeMs: number;
  updatedAt: string;
  byCard: Record<string, ContextCardStat>;
};

export type PracticeStats = {
  recognition?: unknown;
  typing?: unknown;
  listening?: unknown;
  context?: ContextStats;
};

export type ContextSessionCard = CardWithLexicalUnit & {
  lexicalUnit: NonNullable<CardWithLexicalUnit['lexicalUnit']>;
  contextExample: string;
  contextMasked: string;
};
