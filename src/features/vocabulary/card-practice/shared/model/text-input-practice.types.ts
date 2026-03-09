import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import type {
  buildPracticeModeStats
} from '@/features/vocabulary/card-practice/shared/model/build-practice-mode-stats.ts';

import type { PracticeModeStats } from './practice.types.ts';

export type TextInputFeedback = 'idle' | 'correct' | 'wrong';

export type TextInputCardStat = {
  cardId: string;
  lexicalUnitId: string;
  attempts: number;
  wrongCount: number;
  timeMs: number;
  isCorrect?: boolean;
  skipped?: boolean;
};

export type TextInputSessionCard = CardWithLexicalUnit & {
  lexicalUnit: NonNullable<CardWithLexicalUnit['lexicalUnit']>;
};

export interface TextInputPracticeState<TCard, TFeedback, TStat> {
  cardSetId: string | null;

  isAvailable: boolean;
  isActive: boolean;
  isFinished: boolean;

  cards: TCard[];
  index: number;

  feedback: TFeedback;
  locked: boolean;

  input: string;

  attempts: number;
  wrongCount: number;

  statsByCard: Record<string, TStat>;

  start: (cardSetId: string, allCards: CardWithLexicalUnit[]) => void;
  stop: () => void;

  setInput: (value: string) => void;
  submit: () => void;
  skip: () => void;
  next: () => void;
  restart: () => void;
}

export type GetStoredPracticeModeStats = (cardSetId: string) => PracticeModeStats | null;

export type WriteStatsFn<TStat extends TextInputCardStat> = (
  id: string,
  payload: ReturnType<typeof buildPracticeModeStats<TStat>>,
) => void;