import { create } from 'zustand/react';

import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import { createTextInputPracticeMethods } from '@/features/vocabulary/card-practice/shared/model/create-text-input-practice-store.ts';
import { readPracticeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage';
import type {
  GetStoredPracticeModeStats,
  TextInputCardStat,
  TextInputFeedback,
  TextInputPracticeState,
} from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types.ts';

import { writeContextStats } from './context.storage';
import type { ContextSessionCard } from './context.types';
import { pickContextExample } from './context.utils';

interface ContextState extends TextInputPracticeState<
  ContextSessionCard,
  TextInputFeedback,
  TextInputCardStat
> {
  getStoredContext: GetStoredPracticeModeStats;
}

export const useContextStore = create<ContextState>((set, get) => {
  const { initPractice, stop, setInput, submit, skip, next, restart } =
    createTextInputPracticeMethods<ContextSessionCard, TextInputFeedback, TextInputCardStat>({
      set,
      get,
      initialFeedback: 'idle',
      writeStats: writeContextStats,
    });

  const start = (id: string, allCards: CardWithLexicalUnit[]) => {
    const filtered = allCards
      .filter((c) => c.lexicalUnit)
      .map(
        (c) =>
          c as CardWithLexicalUnit & {
            lexicalUnit: NonNullable<CardWithLexicalUnit['lexicalUnit']>;
          },
      )
      .map((c) => {
        const lu = c.lexicalUnit;
        const examples = lu.examples ?? [];
        if (!examples.length) return null;

        const picked = pickContextExample(lu.value ?? '', examples);
        if (!picked) return null;

        const session: ContextSessionCard = {
          ...c,
          lexicalUnit: lu,
          contextExample: picked.example,
          contextMasked: picked.masked,
        };

        return session;
      })
      .filter(Boolean) as ContextSessionCard[];

    initPractice(id, filtered);
  };

  const getStoredContext = (id: string) => {
    const stored = readPracticeStats(id);
    return stored.context ?? null;
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
    getStoredContext,
  };
});