import { useRef, useState } from 'react';

import { buildPracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/build-practice-mode-stats.ts';
import type {
  TextInputCardStat,
  TextInputFeedback,
  TextInputSessionCard,
  WriteStatsFn,
} from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types.ts';

import { norm, round } from './text-input-practice.utils.ts';

export function useTextInputPracticeState<
  TCard extends TextInputSessionCard,
  TFeedback extends TextInputFeedback,
  TStat extends TextInputCardStat
>(initialFeedback: TFeedback, writeStats: WriteStatsFn<TStat>) {
  const [cardSetId, setCardSetId] = useState<string | null>(null);

  const [isAvailable, setIsAvailable] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [cards, setCards] = useState<TCard[]>([]);
  const [index, setIndex] = useState(0);

  const [feedback, setFeedback] = useState<TFeedback>(initialFeedback);
  const [locked, setLocked] = useState(false);

  const [input, setInputState] = useState('');

  const [attempts, setAttempts] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [statsByCard, setStatsByCard] = useState<Record<string, TStat>>({});

  const shownAtRef = useRef(0);

  const resetCardState = () => {
    setFeedback(initialFeedback);
    setLocked(false);
    setInputState('');
    setAttempts(0);
    setWrongCount(0);
    shownAtRef.current = performance.now();
  };

  const initPractice = (cardSetId: string, cards: TCard[]) => {
    setCardSetId(cardSetId);
    setCards(cards);
    setIndex(0);
    setStatsByCard({});
    setIsFinished(false);

    const isAvailable = cards.length >= 1;
    setIsAvailable(isAvailable);
    setIsActive(isAvailable);

    resetCardState();
  };

  const stop = () => {
    setIsActive(false);
    setIsFinished(false);
    setFeedback(initialFeedback);
    setLocked(false);
    setInputState('');
    setAttempts(0);
    setWrongCount(0);
    setStatsByCard({});
  };

  const setInput = (value: string) => {
    if (!isActive || isFinished) return;
    if (locked) return;
    setInputState(value);
  };

  const submit = () => {
    if (!isActive || isFinished) return;

    const card = cards[index] ?? null;
    if (!card) return;

    if (locked) return;

    const expected = norm(card.lexicalUnit.value ?? '');
    if (!expected) return;

    const got = norm(input);
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (got && got === expected) {
      setLocked(true);
      setFeedback('correct' as TFeedback);

      const timeMs = round(performance.now() - shownAtRef.current);

      const stat: TStat = {
        cardId: card.id,
        lexicalUnitId: card.lexicalUnitId,
        attempts: nextAttempts,
        wrongCount,
        timeMs,
        isCorrect: true,
      } as TStat;

      setStatsByCard((prev) => ({
        ...prev,
        [card.id]: stat,
      }));

      return;
    }

    setFeedback('wrong' as TFeedback);
    setWrongCount((v) => v + 1);

    window.setTimeout(() => {
      setFeedback(initialFeedback);
    }, 260);
  };

  const finish = (nextStatsByCard: Record<string, TStat>) => {
    if (!cardSetId) return;

    const payload = buildPracticeModeStats(cards.length, nextStatsByCard);
    writeStats(cardSetId, payload);
    setIsFinished(true);
  };

  const skip = () => {
    if (!isActive || isFinished) return;

    const card = cards[index] ?? null;
    if (!card) return;

    if (locked) return;

    const timeMs = round(performance.now() - shownAtRef.current);

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

    setStatsByCard(nextStatsByCard);

    const isLastCard = index >= cards.length - 1;

    if (isLastCard) {
      finish(nextStatsByCard);
      return;
    }

    setIndex(index + 1);
    resetCardState();
  };

  const next = () => {
    if (!isActive || isFinished) return;
    if (!locked) return;
    if (!cardSetId) return;

    const isLast = index >= cards.length - 1;
    if (isLast) {
      finish(statsByCard);
      return;
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);
    resetCardState();
  };

  const restart = () => {
    if (!cardSetId) return;

    if (cards.length < 1) {
      setIsAvailable(false);
      return;
    }

    setIndex(0);
    setStatsByCard({});
    setIsFinished(false);
    setIsActive(true);
    resetCardState();
  };

  return {
    cardSetId,
    setCardSetId,

    isAvailable,
    setIsAvailable,

    isActive,
    setIsActive,

    isFinished,
    setIsFinished,

    cards,
    setCards,

    index,
    setIndex,

    feedback,
    setFeedback,

    locked,
    setLocked,

    input,
    setInputState,

    attempts,
    setAttempts,

    wrongCount,
    setWrongCount,

    statsByCard,
    setStatsByCard,

    shownAtRef,

    resetCardState,
    initPractice,
    stop,
    setInput,
    submit,
    finish,
    skip,
    next,
    restart,
  };
}