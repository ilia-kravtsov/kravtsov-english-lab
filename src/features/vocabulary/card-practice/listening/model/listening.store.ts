import { createGStore } from 'create-gstore';
import { useRef, useState } from 'react';
import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import type {
  ListeningCardStat,
  ListeningFeedback,
  ListeningSessionCard,
  ListeningStats,
} from './listening.types';
import { readPracticeStats, writeListeningStats } from './listening.storage';
import { norm, round } from './listening.utils.ts';

export interface ListeningState {
  cardSetId: string | null;

  isAvailable: boolean;
  isActive: boolean;
  isFinished: boolean;

  cards: ListeningSessionCard[];
  index: number;

  feedback: ListeningFeedback;
  locked: boolean;

  input: string;

  attempts: number;
  wrongCount: number;

  statsByCard: Record<string, ListeningCardStat>;

  start: (cardSetId: string, allCards: CardWithLexicalUnit[]) => void;
  stop: () => void;

  setInput: (value: string) => void;
  submit: () => void;
  next: () => void;
  restart: () => void;

  getStoredListening: (cardSetId: string) => ListeningStats | null;
}

export const useListeningStore = createGStore<ListeningState>(() => {
  const [cardSetId, setCardSetId] = useState<string | null>(null);

  const [isAvailable, setIsAvailable] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [cards, setCards] = useState<ListeningSessionCard[]>([]);
  const [index, setIndex] = useState(0);

  const [feedback, setFeedback] = useState<ListeningFeedback>('idle');
  const [locked, setLocked] = useState(false);

  const [input, setInputState] = useState('');

  const [attempts, setAttempts] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);

  const [statsByCard, setStatsByCard] = useState<Record<string, ListeningCardStat>>({});

  const shownAtRef = useRef(0);

  const resetCardState = () => {
    setFeedback('idle');
    setLocked(false);
    setInputState('');
    setAttempts(0);
    setWrongCount(0);
    shownAtRef.current = performance.now();
  };

  const finish = (id: string, nextStatsByCard: Record<string, ListeningCardStat>) => {
    const totalCards = cards.length;
    const completedCards = Object.keys(nextStatsByCard).length;
    const correctCards = completedCards;

    const timeSum = Object.values(nextStatsByCard).reduce((acc, s) => acc + (s.timeMs || 0), 0);
    const avgTimeMs = completedCards > 0 ? round(timeSum / completedCards) : 0;
    const accuracy = totalCards > 0 ? round((correctCards / totalCards) * 100) : 0;

    const payload: ListeningStats = {
      totalCards,
      completedCards,
      correctCards,
      accuracy,
      avgTimeMs,
      updatedAt: new Date().toISOString(),
      byCard: nextStatsByCard,
    };

    writeListeningStats(id, payload);
    setIsFinished(true);
  };

  const start = (id: string, allCards: CardWithLexicalUnit[]) => {
    const filtered = allCards
      .filter(c => c.lexicalUnit && Boolean(c.lexicalUnit.audioUrl))
      .map(c => c as ListeningSessionCard);

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

      const stat: ListeningCardStat = {
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

  const getStoredListening = (id: string) => {
    const stored = readPracticeStats(id);
    return stored.listening ?? null;
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
    next,
    restart,

    getStoredListening,
  };
});