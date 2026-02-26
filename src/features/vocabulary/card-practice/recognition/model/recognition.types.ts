import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';

export type RecognitionFeedback = 'idle' | 'correct' | 'wrong';

export type RecognitionCardStat = {
  cardId: string;
  lexicalUnitId: string;
  attempts: number;
  wrongCount: number;
  timeMs: number;
};

export type RecognitionStats = {
  totalCards: number;
  completedCards: number;
  correctCards: number;
  accuracy: number;
  avgTimeMs: number;
  updatedAt: string;
  byCard: Record<string, RecognitionCardStat>;
};

export type PracticeStats = {
  recognition?: RecognitionStats;
  typing?: unknown;
  listening?: unknown;
  context?: unknown;
};

export type RecognitionSessionCard = CardWithLexicalUnit & {
  lexicalUnit: NonNullable<CardWithLexicalUnit['lexicalUnit']>;
};