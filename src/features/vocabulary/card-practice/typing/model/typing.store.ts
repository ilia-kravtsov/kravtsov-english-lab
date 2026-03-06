import { createGStore } from 'create-gstore';
import { useRef, useState } from 'react';

import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import { buildPracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/build-practice-mode-stats.ts';
import { readPracticeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage.ts';
import type { PracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.types.ts';

import { writeTypingStats } from './typing.storage';
import type { TypingCardStat, TypingFeedback, TypingSessionCard } from './typing.types';
import { norm, round } from './typing.utils';

export interface TypingState {
  cardSetId: string | null;

  isAvailable: boolean;
  isActive: boolean;
  isFinished: boolean;

  cards: TypingSessionCard[];
  index: number;

  feedback: TypingFeedback;
  locked: boolean;

  input: string;

  attempts: number;
  wrongCount: number;

  statsByCard: Record<string, TypingCardStat>;

  start: (cardSetId: string, allCards: CardWithLexicalUnit[]) => void;
  stop: () => void;

  setInput: (value: string) => void;
  submit: () => void;
  skip: () => void;
  next: () => void;
  restart: () => void;

  getStoredTyping: (cardSetId: string) => PracticeModeStats | null;
}

export const useTypingStore = createGStore<TypingState>(() => {
  const [cardSetId, setCardSetId] = useState<string | null>(null);

  const [isAvailable, setIsAvailable] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [cards, setCards] = useState<TypingSessionCard[]>([]);
  const [index, setIndex] = useState(0);

  const [feedback, setFeedback] = useState<TypingFeedback>('idle');
  const [locked, setLocked] = useState(false);

  const [input, setInputState] = useState('');

  const [attempts, setAttempts] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [statsByCard, setStatsByCard] = useState<Record<string, TypingCardStat>>({});

  const shownAtRef = useRef(0);

  const resetCardState = () => {
    setFeedback('idle');
    setLocked(false);
    setInputState('');
    setAttempts(0);
    setWrongCount(0);
    shownAtRef.current = performance.now();
  };

  const finish = (id: string, nextStatsByCard: Record<string, TypingCardStat>) => {
    const payload = buildPracticeModeStats(cards.length, nextStatsByCard);

    writeTypingStats(id, payload);
    setIsFinished(true);
  };

  const start = (id: string, allCards: CardWithLexicalUnit[]) => {
    const filtered = allCards
      .filter((c) => c.lexicalUnit && (c.lexicalUnit.translation ?? '').trim().length > 0)
      .map((c) => c as TypingSessionCard);

    setCardSetId(id);
    setCards(filtered);
    setIndex(0);
    setStatsByCard({});
    setIsFinished(false);

    const ok = filtered.length >= 1;
    setIsAvailable(ok);
    setIsActive(true);

    resetCardState();
  };

  const stop = () => {
    setIsActive(false);
    setIsFinished(false);
    setFeedback('idle');
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
      setFeedback('correct');

      const timeMs = round(performance.now() - shownAtRef.current);

      const stat: TypingCardStat = {
        cardId: card.id,
        lexicalUnitId: card.lexicalUnitId,
        attempts: nextAttempts,
        wrongCount,
        timeMs,
        isCorrect: true,
      };

      setStatsByCard((prev) => ({ ...prev, [card.id]: stat }));
      return;
    }

    setFeedback('wrong');
    setWrongCount((v) => v + 1);
    window.setTimeout(() => setFeedback('idle'), 260);
  };

  const skip = () => {
    if (!isActive || isFinished) return;
    const card = cards[index] ?? null;
    if (!card) return;

    const timeMs = round(performance.now() - shownAtRef.current);

    const stat: TypingCardStat = {
      cardId: card.id,
      lexicalUnitId: card.lexicalUnitId,
      attempts,
      wrongCount,
      timeMs,
      isCorrect: false,
      skipped: true,
    };

    const nextStatsByCard = { ...statsByCard, [card.id]: stat };
    setStatsByCard(nextStatsByCard);

    const id = cardSetId;
    if (!id) return;

    const isLast = index >= cards.length - 1;
    if (isLast) {
      finish(id, nextStatsByCard);
      return;
    }

    setIndex(index + 1);
    resetCardState();
  };

  const next = () => {
    if (!isActive || isFinished) return;
    if (!locked) return;
    const id = cardSetId;
    if (!id) return;

    const isLast = index >= cards.length - 1;
    if (isLast) {
      finish(id, statsByCard);
      return;
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);
    resetCardState();
  };

  const restart = () => {
    const id = cardSetId;
    if (!id) return;
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

  const getStoredTyping = (id: string) => {
    const stored = readPracticeStats(id);
    return stored.typing ?? null;
  };

  return {
    cardSetId,

    isAvailable,
    isActive,
    isFinished,

    cards,
    index,

    feedback,
    locked,

    input,

    attempts,
    wrongCount,

    statsByCard,

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
