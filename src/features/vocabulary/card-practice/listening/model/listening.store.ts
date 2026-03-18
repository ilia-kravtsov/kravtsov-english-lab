import { create } from 'zustand/react';

import type { CardWithLexicalUnit } from '@/entities/card';
import { createTextInputPracticeMethods } from '@/features/vocabulary/card-practice/shared/model/create-text-input-practice-store.ts';
import { readPracticeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage';
import type {
  GetStoredPracticeModeStats,
  TextInputCardStat,
  TextInputFeedback,
  TextInputPracticeState,
  TextInputSessionCard,
} from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types.ts';

import { writeListeningStats } from './listening.storage';

interface ListeningState extends TextInputPracticeState<
  TextInputSessionCard,
  TextInputFeedback,
  TextInputCardStat
> {
  getStoredListening: GetStoredPracticeModeStats;
}

export const useListeningStore = create<ListeningState>((set, get) => {
  const { initPractice, stop, setInput, submit, skip, next, restart } =
    createTextInputPracticeMethods<TextInputSessionCard, TextInputFeedback, TextInputCardStat>({
      set,
      get,
      initialFeedback: 'idle',
      writeStats: writeListeningStats,
    });

  const start = (id: string, allCards: CardWithLexicalUnit[]) => {
    const filtered = allCards
      .filter((c) => c.lexicalUnit && Boolean(c.lexicalUnit.audioUrl))
      .map((c) => c as TextInputSessionCard);

    initPractice(id, filtered);
  };

  const getStoredListening = (id: string) => {
    const stored = readPracticeStats(id);
    return stored.listening ?? null;
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
    getStoredListening,
  };
});
