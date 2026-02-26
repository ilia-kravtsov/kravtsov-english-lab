import { createGStore } from 'create-gstore';
import { useMemo, useRef, useState } from 'react';
import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import type {
  RecognitionCardStat,
  RecognitionFeedback,
  RecognitionSessionCard,
  RecognitionStats,
} from './recognition.types';
import { readPracticeStats, writeRecognitionStats } from './recognition.storage';
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

  getStoredRecognition: (cardSetId: string) => RecognitionStats | null;
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

  const translationsPool = useMemo(() => {
    return uniqNonEmpty(cards.map(c => c.lexicalUnit.translation ?? ''));
  }, [cards]);

  const resetCardState = (card: RecognitionSessionCard | null) => {
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
    const pool = translationsPool.filter(t => t !== correct);
    const want = Math.min(3, pool.length);
    const distractors = shuffle(pool).slice(0, want);
    setOptions(shuffle([correct, ...distractors]));

    shownAtRef.current = performance.now();
  };

  const finish = (id: string, nextStatsByCard: Record<string, RecognitionCardStat>) => {
    const totalCards = cards.length;
    const completedCards = Object.keys(nextStatsByCard).length;
    const correctCards = completedCards;

    const timeSum = Object.values(nextStatsByCard).reduce((acc, s) => acc + (s.timeMs || 0), 0);
    const avgTimeMs = completedCards > 0 ? round(timeSum / completedCards) : 0;
    const accuracy = totalCards > 0 ? round((correctCards / totalCards) * 100) : 0;

    const payload: RecognitionStats = {
      totalCards,
      completedCards,
      correctCards,
      accuracy,
      avgTimeMs,
      updatedAt: new Date().toISOString(),
      byCard: nextStatsByCard,
    };

    writeRecognitionStats(id, payload);
    setIsFinished(true);
  };

  const start = (id: string, allCards: CardWithLexicalUnit[]) => {
    const filtered = allCards
      .filter(c => c.lexicalUnit && norm(c.lexicalUnit.translation ?? '').length > 0)
      .map(c => c as RecognitionSessionCard);

    setCardSetId(id);
    setCards(filtered);
    setIndex(0);
    setStatsByCard({});
    setIsFinished(false);

    const ok = filtered.length >= 2;
    setIsAvailable(ok);
    setIsActive(true);

    resetCardState(filtered[0] ?? null);
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

      setStatsByCard(prev => ({ ...prev, [card.id]: stat }));
      return;
    }

    setFeedback('wrong');
    setWrongCount(v => v + 1);
    setDisabled(prev => ({ ...prev, [picked]: true }));
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
    resetCardState(cards[0] ?? null);
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