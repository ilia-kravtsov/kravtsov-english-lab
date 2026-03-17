import { create } from 'zustand/react';

import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import { buildPracticeModeStats, round } from '@/features/vocabulary/card-practice/shared';
import { readPracticeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage';
import type {
  GetStoredPracticeModeStats,
  TextInputCardStat,
  TextInputFeedback,
  TextInputPracticeState,
} from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types.ts';
import { norm } from '@/features/vocabulary/card-practice/shared/model/text-input-practice.utils.ts';

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

let shownAt = 0;
let feedbackResetTimer: number | null = null;

function clearFeedbackResetTimer() {
  if (feedbackResetTimer !== null) {
    window.clearTimeout(feedbackResetTimer);
    feedbackResetTimer = null;
  }
}

export const useContextStore = create<ContextState>((set, get) => {
  const resetCardState = () => {
    clearFeedbackResetTimer();

    shownAt = performance.now();

    set({
      feedback: 'idle',
      locked: false,
      input: '',
      attempts: 0,
      wrongCount: 0,
    });
  };

  const finish = (nextStatsByCard: Record<string, TextInputCardStat>) => {
    const { cardSetId, cards } = get();
    if (!cardSetId) return;

    const payload = buildPracticeModeStats(cards.length, nextStatsByCard);
    writeContextStats(cardSetId, payload);

    set({
      isFinished: true,
    });
  };

  const initPractice = (cardSetId: string, cards: ContextSessionCard[]) => {
    const isAvailable = cards.length >= 1;

    set({
      cardSetId,
      cards,
      index: 0,
      statsByCard: {},
      isFinished: false,
      isAvailable,
      isActive: isAvailable,
    });

    resetCardState();
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

    start: (id, allCards) => {
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
    },

    initPractice,

    stop: () => {
      clearFeedbackResetTimer();

      set({
        isActive: false,
        isFinished: false,
        feedback: 'idle',
        locked: false,
        input: '',
        attempts: 0,
        wrongCount: 0,
        statsByCard: {},
      });
    },

    setInput: (value) => {
      const { isActive, isFinished, locked } = get();
      if (!isActive || isFinished) return;
      if (locked) return;

      set({
        input: value,
      });
    },

    submit: () => {
      const { isActive, isFinished, cards, index, locked, input, attempts, wrongCount } = get();

      if (!isActive || isFinished) return;

      const card = cards[index] ?? null;
      if (!card) return;

      if (locked) return;

      const expected = norm(card.lexicalUnit.value ?? '');
      if (!expected) return;

      const got = norm(input);
      const nextAttempts = attempts + 1;

      set({
        attempts: nextAttempts,
      });

      if (got && got === expected) {
        const timeMs = round(performance.now() - shownAt);

        const stat: TextInputCardStat = {
          cardId: card.id,
          lexicalUnitId: card.lexicalUnitId,
          attempts: nextAttempts,
          wrongCount,
          timeMs,
          isCorrect: true,
        };

        set((state) => ({
          locked: true,
          feedback: 'correct',
          statsByCard: {
            ...state.statsByCard,
            [card.id]: stat,
          },
        }));

        return;
      }

      clearFeedbackResetTimer();

      set((state) => ({
        feedback: 'wrong',
        wrongCount: state.wrongCount + 1,
      }));

      feedbackResetTimer = window.setTimeout(() => {
        const state = get();
        if (!state.isActive || state.isFinished) return;
        if (state.feedback !== 'wrong') return;

        set({
          feedback: 'idle',
        });

        feedbackResetTimer = null;
      }, 260);
    },

    skip: () => {
      const { isActive, isFinished, cards, index, locked, attempts, wrongCount, statsByCard } =
        get();

      if (!isActive || isFinished) return;

      const card = cards[index] ?? null;
      if (!card) return;

      if (locked) return;

      const timeMs = round(performance.now() - shownAt);

      const stat: TextInputCardStat = {
        cardId: card.id,
        lexicalUnitId: card.lexicalUnitId,
        attempts,
        wrongCount,
        timeMs,
        isCorrect: false,
        skipped: true,
      };

      const nextStatsByCard = {
        ...statsByCard,
        [card.id]: stat,
      };

      const isLastCard = index >= cards.length - 1;

      if (isLastCard) {
        set({
          statsByCard: nextStatsByCard,
        });

        finish(nextStatsByCard);
        return;
      }

      set({
        statsByCard: nextStatsByCard,
        index: index + 1,
      });

      resetCardState();
    },

    next: () => {
      const { isActive, isFinished, locked, cardSetId, index, cards, statsByCard } = get();

      if (!isActive || isFinished) return;
      if (!locked) return;
      if (!cardSetId) return;

      const isLast = index >= cards.length - 1;

      if (isLast) {
        finish(statsByCard);
        return;
      }

      set({
        index: index + 1,
      });

      resetCardState();
    },

    restart: () => {
      const { cardSetId, cards } = get();
      if (!cardSetId) return;

      if (cards.length < 1) {
        set({
          isAvailable: false,
        });
        return;
      }

      set({
        index: 0,
        statsByCard: {},
        isFinished: false,
        isActive: true,
      });

      resetCardState();
    },

    getStoredContext: (id) => {
      const stored = readPracticeStats(id);
      return stored.context ?? null;
    },
  };
});