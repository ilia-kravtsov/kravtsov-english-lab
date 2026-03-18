import type { StateCreator } from 'zustand';

import { buildPracticeModeStats } from '@/features/vocabulary/card-practice/shared';

import type {
  TextInputCardStat,
  TextInputFeedback,
  TextInputPracticeState,
  TextInputSessionCard,
} from './text-input-practice.types';
import { norm, round } from './text-input-practice.utils';

type WriteStatsFn<TStat extends TextInputCardStat> = (
  cardSetId: string,
  payload: ReturnType<typeof buildPracticeModeStats<TStat>>,
) => void;

interface CreateTextInputPracticeMethodsParams<
  TCard extends TextInputSessionCard,
  TFeedback extends TextInputFeedback,
  TStat extends TextInputCardStat,
> {
  set: Parameters<StateCreator<TextInputPracticeState<TCard, TFeedback, TStat>>>[0];
  get: Parameters<StateCreator<TextInputPracticeState<TCard, TFeedback, TStat>>>[1];
  initialFeedback: TFeedback;
  writeStats: WriteStatsFn<TStat>;
}

export function createTextInputPracticeMethods<
  TCard extends TextInputSessionCard,
  TFeedback extends TextInputFeedback,
  TStat extends TextInputCardStat,
>({
    set,
    get,
    initialFeedback,
    writeStats,
  }: CreateTextInputPracticeMethodsParams<TCard, TFeedback, TStat>) {
  let shownAt = 0;
  let feedbackResetTimer: number | null = null;

  const clearFeedbackResetTimer = () => {
    if (feedbackResetTimer !== null) {
      window.clearTimeout(feedbackResetTimer);
      feedbackResetTimer = null;
    }
  };

  const resetCardState = () => {
    clearFeedbackResetTimer();

    shownAt = performance.now();

    set({
      feedback: initialFeedback,
      locked: false,
      input: '',
      attempts: 0,
      wrongCount: 0,
    });
  };

  const finish = (nextStatsByCard: Record<string, TStat>) => {
    const { cardSetId, cards } = get();
    if (!cardSetId) return;

    const payload = buildPracticeModeStats(cards.length, nextStatsByCard);
    writeStats(cardSetId, payload);

    set({
      isFinished: true,
    });
  };

  const initPractice = (cardSetId: string, cards: TCard[]) => {
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

  const stop = () => {
    clearFeedbackResetTimer();

    set({
      isActive: false,
      isFinished: false,
      feedback: initialFeedback,
      locked: false,
      input: '',
      attempts: 0,
      wrongCount: 0,
      statsByCard: {},
    });
  };

  const setInput = (value: string) => {
    const { isActive, isFinished, locked } = get();
    if (!isActive || isFinished) return;
    if (locked) return;

    set({
      input: value,
    });
  };

  const submit = () => {
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

      const stat: TStat = {
        cardId: card.id,
        lexicalUnitId: card.lexicalUnitId,
        attempts: nextAttempts,
        wrongCount,
        timeMs,
        isCorrect: true,
      } as TStat;

      set((state) => ({
        locked: true,
        feedback: 'correct' as TFeedback,
        statsByCard: {
          ...state.statsByCard,
          [card.id]: stat,
        },
      }));

      return;
    }

    clearFeedbackResetTimer();

    set((state) => ({
      feedback: 'wrong' as TFeedback,
      wrongCount: state.wrongCount + 1,
    }));

    feedbackResetTimer = window.setTimeout(() => {
      const state = get();
      if (!state.isActive || state.isFinished) return;
      if (state.feedback !== 'wrong') return;

      set({
        feedback: initialFeedback,
      });

      feedbackResetTimer = null;
    }, 260);
  };

  const skip = () => {
    const { isActive, isFinished, cards, index, locked, attempts, wrongCount, statsByCard } =
      get();

    if (!isActive || isFinished) return;

    const card = cards[index] ?? null;
    if (!card) return;

    if (locked) return;

    const timeMs = round(performance.now() - shownAt);

    const stat: TStat = {
      cardId: card.id,
      lexicalUnitId: card.lexicalUnitId,
      attempts,
      wrongCount,
      timeMs,
      isCorrect: false,
      skipped: true,
    } as TStat;

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
  };

  const next = () => {
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
  };

  const restart = () => {
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
  };

  return {
    initPractice,
    stop,
    setInput,
    submit,
    skip,
    next,
    restart,
  };
}