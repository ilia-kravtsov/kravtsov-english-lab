import { create } from 'zustand';

import type { CardWithLexicalUnit } from '@/entities/card';
import { buildRecognitionPracticeStats } from '@/features/vocabulary/card-practice/shared/model/build-recognition-practice-stats';
import { readPracticeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage';
import type { PracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.types';
import { shuffle } from '@/features/vocabulary/card-practice/shared/model/shuffle.ts';
import type {
  BasePracticeState,
  TextInputCardStat,
  TextInputFeedback,
  TextInputSessionCard,
} from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types.ts';
import { round } from '@/features/vocabulary/card-practice/shared/model/text-input-practice.utils.ts';

import { writeRecognitionStats } from './recognition.storage';
import { norm, uniqNonEmpty } from './recognition.utils';

interface RecognitionState extends BasePracticeState<
  TextInputSessionCard,
  TextInputFeedback,
  TextInputCardStat
> {
  options: string[];
  disabled: Record<string, true>;
  selected: string | null;

  answer: (option: string) => void;

  getStoredRecognition: (cardSetId: string) => PracticeModeStats | null;
}

let shownAt = 0;
let feedbackResetTimer: number | null = null;

function clearFeedbackResetTimer() {
  if (feedbackResetTimer !== null) {
    window.clearTimeout(feedbackResetTimer);
    feedbackResetTimer = null;
  }
}

export const useRecognitionStore = create<RecognitionState>((set, get) => {
  const resetCardState = (card: TextInputSessionCard | null, poolOverride?: string[]) => {
    clearFeedbackResetTimer();

    if (!card) {
      set({
        feedback: 'idle',
        locked: false,
        disabled: {},
        selected: null,
        attempts: 0,
        wrongCount: 0,
        options: [],
      });
      return;
    }

    const correct = norm(card.lexicalUnit.translation ?? '');

    const { cards } = get();
    const poolBase =
      poolOverride ?? uniqNonEmpty(cards.map((c) => c.lexicalUnit.translation ?? ''));
    const pool = poolBase.filter((t) => t !== correct);

    const want = Math.min(3, pool.length);
    const distractors = shuffle(pool).slice(0, want);
    const options = shuffle([correct, ...distractors]);

    shownAt = performance.now();

    set({
      feedback: 'idle',
      locked: false,
      disabled: {},
      selected: null,
      attempts: 0,
      wrongCount: 0,
      options,
    });
  };

  const finish = (id: string, nextStatsByCard: Record<string, TextInputCardStat>) => {
    const { cards } = get();

    const payload = buildRecognitionPracticeStats(cards.length, nextStatsByCard);
    writeRecognitionStats(id, payload);

    set({
      isFinished: true,
    });
  };

  const start = (id: string, allCards: CardWithLexicalUnit[]) => {
    const filtered = allCards
      .filter((c) => c.lexicalUnit && norm(c.lexicalUnit.translation ?? '').length > 0)
      .map((c) => c as TextInputSessionCard);

    const isAvailable = filtered.length >= 2;

    set({
      cardSetId: id,
      cards: filtered,
      index: 0,
      statsByCard: {},
      isFinished: false,
      isAvailable,
      isActive: true,
    });

    const pool = uniqNonEmpty(filtered.map((c) => c.lexicalUnit.translation ?? ''));
    resetCardState(filtered[0] ?? null, pool);
  };

  const stop = () => {
    clearFeedbackResetTimer();

    set({
      isActive: false,
      isFinished: false,
      feedback: 'idle',
      locked: false,
      options: [],
      disabled: {},
      selected: null,
      attempts: 0,
      wrongCount: 0,
      statsByCard: {},
    });
  };

  const answer = (opt: string) => {
    const { isActive, isFinished, cards, index, locked, attempts, wrongCount } = get();

    if (!isActive || isFinished) return;

    const card = cards[index] ?? null;
    if (!card) return;

    if (locked) return;

    const correct = norm(card.lexicalUnit.translation ?? '');
    const picked = norm(opt);

    if (!correct || !picked) return;

    const nextAttempts = attempts + 1;

    set({
      attempts: nextAttempts,
    });

    if (picked === correct) {
      const timeMs = round(performance.now() - shownAt);

      const stat: TextInputCardStat = {
        cardId: card.id,
        lexicalUnitId: card.lexicalUnitId,
        attempts: nextAttempts,
        wrongCount,
        timeMs,
      };

      set((state) => ({
        locked: true,
        selected: picked,
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
      disabled: {
        ...state.disabled,
        [picked]: true,
      },
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
  };

  const next = () => {
    const { isActive, isFinished, locked, cardSetId, index, cards, statsByCard } = get();

    if (!isActive || isFinished) return;
    if (!locked) return;
    if (!cardSetId) return;

    const isLast = index >= cards.length - 1;

    if (isLast) {
      finish(cardSetId, statsByCard);
      return;
    }

    const nextIndex = index + 1;

    set({
      index: nextIndex,
    });

    resetCardState(cards[nextIndex] ?? null);
  };

  const restart = () => {
    const { cardSetId, cards } = get();

    if (!cardSetId) return;

    if (cards.length < 2) {
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

    const pool = uniqNonEmpty(cards.map((c) => c.lexicalUnit.translation ?? ''));
    resetCardState(cards[0] ?? null, pool);
  };

  const getStoredRecognition = (id: string) => {
    const stored = readPracticeStats(id);
    return stored.recognition ?? null;
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

    options: [],
    disabled: {},
    selected: null,

    attempts: 0,
    wrongCount: 0,

    statsByCard: {},

    start,
    stop,
    answer,
    next,
    restart,
    getStoredRecognition,
  };
});
