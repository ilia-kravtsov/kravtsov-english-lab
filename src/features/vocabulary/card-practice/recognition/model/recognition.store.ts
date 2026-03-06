import { createGStore } from 'create-gstore';
import { useRef, useState } from 'react';

import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import { buildRecognitionPracticeStats } from '@/features/vocabulary/card-practice/shared/model/build-recognition-practice-stats.ts';
import { readPracticeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage.ts';
import type { PracticeStats } from '@/features/vocabulary/card-practice/shared/model/practice.types.ts';

import { writeRecognitionStats } from './recognition.storage';
import type {
  RecognitionCardStat,
  RecognitionFeedback,
  RecognitionSessionCard,
} from './recognition.types';
import { norm, round, shuffle, uniqNonEmpty } from './recognition.utils';

export interface RecognitionState {
  cardSetId: string | null;

  isAvailable: boolean;
  isActive: boolean;
  isFinished: boolean;

  cards: RecognitionSessionCard[];
  index: number;

  feedback: RecognitionFeedback;
  locked: boolean;

  options: string[];
  disabled: Record<string, true>;
  selected: string | null;

  attempts: number;
  wrongCount: number;

  statsByCard: Record<string, RecognitionCardStat>;

  start: (cardSetId: string, allCards: CardWithLexicalUnit[]) => void;
  stop: () => void;

  answer: (option: string) => void;
  next: () => void;
  restart: () => void;

  getStoredRecognition: (cardSetId: string) => PracticeStats | null;
}

export const useRecognitionStore = createGStore<RecognitionState>(() => {
  const [cardSetId, setCardSetId] = useState<string | null>(null);

  const [isAvailable, setIsAvailable] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [cards, setCards] = useState<RecognitionSessionCard[]>([]);
  const [index, setIndex] = useState(0);

  const [feedback, setFeedback] = useState<RecognitionFeedback>('idle');
  const [locked, setLocked] = useState(false);

  const [options, setOptions] = useState<string[]>([]);
  const [disabled, setDisabled] = useState<Record<string, true>>({});
  const [selected, setSelected] = useState<string | null>(null);

  const [attempts, setAttempts] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [statsByCard, setStatsByCard] = useState<Record<string, RecognitionCardStat>>({});

  const shownAtRef = useRef(0);

  const resetCardState = (card: RecognitionSessionCard | null, poolOverride?: string[]) => {
    setFeedback('idle');
    setLocked(false);
    setDisabled({});
    setSelected(null);
    setAttempts(0);
    setWrongCount(0);

    if (!card) {
      setOptions([]);
      return;
    }

    const correct = norm(card.lexicalUnit.translation ?? '');

    const poolBase =
      poolOverride ?? uniqNonEmpty(cards.map((c) => c.lexicalUnit.translation ?? ''));
    const pool = poolBase.filter((t) => t !== correct);

    const want = Math.min(3, pool.length);
    const distractors = shuffle(pool).slice(0, want);
    setOptions(shuffle([correct, ...distractors]));

    shownAtRef.current = performance.now();
  };

  const finish = (id: string, nextStatsByCard: Record<string, RecognitionCardStat>) => {
    const payload = buildRecognitionPracticeStats(cards.length, nextStatsByCard);

    writeRecognitionStats(id, payload);
    setIsFinished(true);
  };

  const start = (id: string, allCards: CardWithLexicalUnit[]) => {
    const filtered = allCards
      .filter((c) => c.lexicalUnit && norm(c.lexicalUnit.translation ?? '').length > 0)
      .map((c) => c as RecognitionSessionCard);

    setCardSetId(id);
    setCards(filtered);
    setIndex(0);
    setStatsByCard({});
    setIsFinished(false);

    const ok = filtered.length >= 2;
    setIsAvailable(ok);
    setIsActive(true);

    const pool = uniqNonEmpty(filtered.map((c) => c.lexicalUnit.translation ?? ''));
    resetCardState(filtered[0] ?? null, pool);
  };

  const stop = () => {
    setIsActive(false);
    setIsFinished(false);
    setFeedback('idle');
    setLocked(false);
    setOptions([]);
    setDisabled({});
    setSelected(null);
    setAttempts(0);
    setWrongCount(0);
    setStatsByCard({});
  };

  const answer = (opt: string) => {
    if (!isActive || isFinished) return;
    const card = cards[index] ?? null;
    if (!card) return;
    if (locked) return;

    const correct = norm(card.lexicalUnit.translation ?? '');
    const picked = norm(opt);
    if (!correct || !picked) return;

    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);

    if (picked === correct) {
      setLocked(true);
      setSelected(picked);
      setFeedback('correct');

      const timeMs = round(performance.now() - shownAtRef.current);

      const stat: RecognitionCardStat = {
        cardId: card.id,
        lexicalUnitId: card.lexicalUnitId,
        attempts: nextAttempts,
        wrongCount,
        timeMs,
      };

      setStatsByCard((prev) => ({ ...prev, [card.id]: stat }));
      return;
    }

    setFeedback('wrong');
    setWrongCount((v) => v + 1);
    setDisabled((prev) => ({ ...prev, [picked]: true }));
    window.setTimeout(() => setFeedback('idle'), 260);
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
    resetCardState(cards[nextIndex] ?? null);
  };

  const restart = () => {
    const id = cardSetId;
    if (!id) return;
    if (cards.length < 2) {
      setIsAvailable(false);
      return;
    }

    setIndex(0);
    setStatsByCard({});
    setIsFinished(false);
    setIsActive(true);
    const pool = uniqNonEmpty(cards.map((c) => c.lexicalUnit.translation ?? ''));
    resetCardState(cards[0] ?? null, pool);
  };

  const getStoredRecognition = (id: string) => {
    const stored = readPracticeStats(id);
    return stored.recognition ?? null;
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

    options,
    disabled,
    selected,

    attempts,
    wrongCount,

    statsByCard,

    start,
    stop,

    answer,
    next,
    restart,

    getStoredRecognition,
  };
});
