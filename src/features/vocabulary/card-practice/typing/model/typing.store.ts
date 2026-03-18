import { create } from 'zustand/react';

import type { CardWithLexicalUnit } from '@/entities/card';
import { createTextInputPracticeMethods } from '@/features/vocabulary/card-practice/shared/model/create-text-input-practice-store.ts';
import { readPracticeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage.ts';
import type {
  GetStoredPracticeModeStats,
  TextInputCardStat,
  TextInputFeedback,
  TextInputPracticeState,
  TextInputSessionCard,
} from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types.ts';

import { writeTypingStats } from './typing.storage';

interface TypingState extends TextInputPracticeState<
  TextInputSessionCard,
  TextInputFeedback,
  TextInputCardStat
> {
  getStoredTyping: GetStoredPracticeModeStats;
}

export const useTypingStore = create<TypingState>((set, get) => {
  const { initPractice, stop, setInput, submit, skip, next, restart } =
    createTextInputPracticeMethods<TextInputSessionCard, TextInputFeedback, TextInputCardStat>({
      set,
      get,
      initialFeedback: 'idle',
      writeStats: writeTypingStats,
    });

  const start = (id: string, allCards: CardWithLexicalUnit[]) => {
    const filtered = allCards
      .filter((c) => c.lexicalUnit && (c.lexicalUnit.translation ?? '').trim().length > 0)
      .map((c) => c as TextInputSessionCard);

    initPractice(id, filtered);
  };

  const getStoredTyping = (id: string) => {
    const stored = readPracticeStats(id);
    return stored.typing ?? null;
  };

  return {
    cardSetId: null,

    isAvailable: false,
    isActive: false,
    isFinished: false,

    cards: [],
    index: 0,

    feedback: 'idle',
    locked: false,

    input: '',

    attempts: 0,
    wrongCount: 0,

    statsByCard: {},

    initPractice,
    start,
    stop,
    setInput,
    submit,
    skip,
    next,
    restart,
    getStoredTyping,
  };
});
