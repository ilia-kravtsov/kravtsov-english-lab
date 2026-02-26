import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';

export type ListeningFeedback = 'idle' | 'correct' | 'wrong';

export type ListeningCardStat = {
  cardId: string;
  lexicalUnitId: string;
  attempts: number;
  wrongCount: number;
  timeMs: number;
};

export type ListeningStats = {
  totalCards: number;
  completedCards: number;
  correctCards: number;
  accuracy: number;
  avgTimeMs: number;
  updatedAt: string;
  byCard: Record<string, ListeningCardStat>;
};

export type PracticeStats = {
  recognition?: unknown;
  typing?: unknown;
  listening?: ListeningStats;
  context?: unknown;
};

export type ListeningSessionCard = CardWithLexicalUnit & {
  lexicalUnit: NonNullable<CardWithLexicalUnit['lexicalUnit']>;
};