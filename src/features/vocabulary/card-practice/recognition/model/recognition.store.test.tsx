import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { CardWithLexicalUnit } from '@/entities/card';
import type { LexicalUnitType } from '@/entities/lexical-unit';

import { useRecognitionStore } from './recognition.store';

const readPracticeStatsMock = vi.fn();
const writeRecognitionStatsMock = vi.fn();

vi.mock('@/features/vocabulary/card-practice/shared/model/practice.storage', () => ({
  readPracticeStats: (...args: unknown[]) => readPracticeStatsMock(...args),
}));

vi.mock('./recognition.storage', () => ({
  writeRecognitionStats: (...args: unknown[]) => writeRecognitionStatsMock(...args),
}));

vi.mock('@/features/vocabulary/card-practice/shared/model/shuffle', () => ({
  shuffle: <T,>(arr: T[]) => [...arr],
}));

const WORD_TYPE = 'word' as LexicalUnitType;

const cards: CardWithLexicalUnit[] = [
  {
    id: 'card-1',
    cardSetId: 'set-1',
    lexicalUnitId: 'lu-1',
    note: null,
    sortOrder: 0,
    createdAt: '2026-04-08T00:00:00.000Z',
    updatedAt: '2026-04-08T00:00:00.000Z',
    lexicalUnit: {
      id: 'lu-1',
      type: WORD_TYPE,
      value: 'hello',
      translation: 'привет',
    },
  },
  {
    id: 'card-2',
    cardSetId: 'set-1',
    lexicalUnitId: 'lu-2',
    note: null,
    sortOrder: 1,
    createdAt: '2026-04-08T00:00:00.000Z',
    updatedAt: '2026-04-08T00:00:00.000Z',
    lexicalUnit: {
      id: 'lu-2',
      type: WORD_TYPE,
      value: 'world',
      translation: 'мир',
    },
  },
  {
    id: 'card-3',
    cardSetId: 'set-1',
    lexicalUnitId: 'lu-3',
    note: null,
    sortOrder: 2,
    createdAt: '2026-04-08T00:00:00.000Z',
    updatedAt: '2026-04-08T00:00:00.000Z',
    lexicalUnit: {
      id: 'lu-3',
      type: WORD_TYPE,
      value: 'sun',
      translation: 'солнце',
    },
  },
];

const invalidNoTranslation: CardWithLexicalUnit = {
  id: 'card-4',
  cardSetId: 'set-1',
  lexicalUnitId: 'lu-4',
  note: null,
  sortOrder: 3,
  createdAt: '2026-04-08T00:00:00.000Z',
  updatedAt: '2026-04-08T00:00:00.000Z',
  lexicalUnit: {
    id: 'lu-4',
    type: WORD_TYPE,
    value: 'tree',
    translation: '',
  },
};

const invalidWhitespaceTranslation: CardWithLexicalUnit = {
  id: 'card-5',
  cardSetId: 'set-1',
  lexicalUnitId: 'lu-5',
  note: null,
  sortOrder: 4,
  createdAt: '2026-04-08T00:00:00.000Z',
  updatedAt: '2026-04-08T00:00:00.000Z',
  lexicalUnit: {
    id: 'lu-5',
    type: WORD_TYPE,
    value: 'sky',
    translation: '   ',
  },
};

const invalidNoLexicalUnit: CardWithLexicalUnit = {
  id: 'card-6',
  cardSetId: 'set-1',
  lexicalUnitId: 'lu-6',
  note: null,
  sortOrder: 5,
  createdAt: '2026-04-08T00:00:00.000Z',
  updatedAt: '2026-04-08T00:00:00.000Z',
  lexicalUnit: null,
};

describe('useRecognitionStore', () => {
  beforeEach(() => {
    readPracticeStatsMock.mockReset();
    writeRecognitionStatsMock.mockReset();
    vi.restoreAllMocks();
    vi.spyOn(performance, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('start keeps only cards with non-empty translation and initializes options', async () => {
    const { result } = renderHook(() => useRecognitionStore());

    act(() => {
      result.current.start('set-1', [
        cards[0],
        cards[1],
        cards[2],
        invalidNoTranslation,
        invalidWhitespaceTranslation,
        invalidNoLexicalUnit,
      ]);
    });

    await waitFor(() => {
      expect(result.current.cardSetId).toBe('set-1');
      expect(result.current.cards).toEqual(cards);
      expect(result.current.index).toBe(0);
      expect(result.current.isAvailable).toBe(true);
      expect(result.current.isActive).toBe(true);
      expect(result.current.isFinished).toBe(false);
      expect(result.current.feedback).toBe('idle');
      expect(result.current.locked).toBe(false);
      expect(result.current.disabled).toEqual({});
      expect(result.current.selected).toBeNull();
      expect(result.current.attempts).toBe(0);
      expect(result.current.wrongCount).toBe(0);
      expect(result.current.statsByCard).toEqual({});
      expect(result.current.options).toEqual(['привет', 'мир', 'солнце']);
    });
  });

  it('start marks practice unavailable when fewer than 2 valid cards remain', async () => {
    const { result } = renderHook(() => useRecognitionStore());

    act(() => {
      result.current.start('set-1', [cards[0], invalidNoTranslation, invalidNoLexicalUnit]);
    });

    await waitFor(() => {
      expect(result.current.cardSetId).toBe('set-1');
      expect(result.current.cards).toEqual([cards[0]]);
      expect(result.current.isAvailable).toBe(false);
      expect(result.current.isActive).toBe(true);
      expect(result.current.options).toEqual(['привет']);
    });
  });

  it('answer stores correct answer stat and locks card', async () => {
    const { result } = renderHook(() => useRecognitionStore());

    act(() => {
      result.current.start('set-1', cards);
    });

    await waitFor(() => {
      expect(result.current.options).toEqual(['привет', 'мир', 'солнце']);
    });

    vi.mocked(performance.now).mockReturnValueOnce(1450);

    act(() => {
      result.current.answer('  привет ');
    });

    await waitFor(() => {
      expect(result.current.attempts).toBe(1);
      expect(result.current.locked).toBe(true);
      expect(result.current.selected).toBe('привет');
      expect(result.current.feedback).toBe('correct');
      expect(result.current.wrongCount).toBe(0);
      expect(result.current.statsByCard).toEqual({
        'card-1': {
          cardId: 'card-1',
          lexicalUnitId: 'lu-1',
          attempts: 1,
          wrongCount: 0,
          timeMs: 450,
        },
      });
    });
  });

  it('answer does nothing when card is already locked', async () => {
    const { result } = renderHook(() => useRecognitionStore());

    act(() => {
      result.current.start('set-1', cards);
    });

    await waitFor(() => {
      expect(result.current.options).toEqual(['привет', 'мир', 'солнце']);
    });

    act(() => {
      result.current.answer('привет');
    });

    await waitFor(() => {
      expect(result.current.locked).toBe(true);
      expect(result.current.attempts).toBe(1);
    });

    act(() => {
      result.current.answer('мир');
    });

    await waitFor(() => {
      expect(result.current.attempts).toBe(1);
      expect(result.current.wrongCount).toBe(0);
      expect(result.current.disabled).toEqual({});
    });
  });

  it('next moves to next card and resets card-local state after correct answer', async () => {
    const { result } = renderHook(() => useRecognitionStore());

    act(() => {
      result.current.start('set-1', cards);
    });

    await waitFor(() => {
      expect(result.current.options).toEqual(['привет', 'мир', 'солнце']);
    });

    act(() => {
      result.current.answer('привет');
    });

    await waitFor(() => {
      expect(result.current.locked).toBe(true);
    });

    act(() => {
      result.current.next();
    });

    await waitFor(() => {
      expect(result.current.index).toBe(1);
      expect(result.current.feedback).toBe('idle');
      expect(result.current.locked).toBe(false);
      expect(result.current.disabled).toEqual({});
      expect(result.current.selected).toBeNull();
      expect(result.current.attempts).toBe(0);
      expect(result.current.wrongCount).toBe(0);
      expect(result.current.options).toEqual(['мир', 'привет', 'солнце']);
    });
  });

  it('next on last locked card finishes practice and writes aggregated stats', async () => {
    const { result } = renderHook(() => useRecognitionStore());

    act(() => {
      result.current.start('set-1', [cards[0], cards[1]]);
    });

    await waitFor(() => {
      expect(result.current.options).toEqual(['привет', 'мир']);
    });

    vi.mocked(performance.now).mockReturnValueOnce(1300);

    act(() => {
      result.current.answer('привет');
    });

    await waitFor(() => {
      expect(result.current.locked).toBe(true);
    });

    act(() => {
      result.current.next();
    });

    await waitFor(() => {
      expect(result.current.index).toBe(1);
      expect(result.current.options).toEqual(['мир', 'привет']);
    });

    vi.mocked(performance.now).mockReturnValueOnce(1700);

    act(() => {
      result.current.answer('мир');
    });

    await waitFor(() => {
      expect(result.current.locked).toBe(true);
    });

    act(() => {
      result.current.next();
    });

    await waitFor(() => {
      expect(result.current.isFinished).toBe(true);
    });

    expect(writeRecognitionStatsMock).toHaveBeenCalledTimes(1);
    expect(writeRecognitionStatsMock).toHaveBeenCalledWith('set-1', {
      totalCards: 2,
      completedCards: 2,
      firstTryCorrectCards: 2,
      wrongAnswers: 0,
      skippedCards: 0,
      totalAnswers: 2,
      correctAnswers: 2,
      avgTimeMs: 500,
    });
  });

  it('restart resets progress and rebuilds options when enough cards exist', async () => {
    const { result } = renderHook(() => useRecognitionStore());

    act(() => {
      result.current.start('set-1', cards);
    });

    await waitFor(() => {
      expect(result.current.options).toEqual(['привет', 'мир', 'солнце']);
    });

    act(() => {
      result.current.answer('мир');
    });

    await waitFor(() => {
      expect(result.current.wrongCount).toBe(1);
      expect(result.current.disabled).toEqual({ мир: true });
    });

    act(() => {
      result.current.restart();
    });

    await waitFor(() => {
      expect(result.current.index).toBe(0);
      expect(result.current.statsByCard).toEqual({});
      expect(result.current.isFinished).toBe(false);
      expect(result.current.isActive).toBe(true);
      expect(result.current.feedback).toBe('idle');
      expect(result.current.locked).toBe(false);
      expect(result.current.disabled).toEqual({});
      expect(result.current.selected).toBeNull();
      expect(result.current.attempts).toBe(0);
      expect(result.current.wrongCount).toBe(0);
      expect(result.current.options).toEqual(['привет', 'мир', 'солнце']);
    });
  });

  it('restart marks practice unavailable when there are fewer than 2 cards', async () => {
    const { result } = renderHook(() => useRecognitionStore());

    act(() => {
      result.current.start('set-1', [cards[0], invalidNoTranslation]);
    });

    await waitFor(() => {
      expect(result.current.cards).toEqual([cards[0]]);
      expect(result.current.isAvailable).toBe(false);
    });

    act(() => {
      result.current.restart();
    });

    await waitFor(() => {
      expect(result.current.isAvailable).toBe(false);
    });
  });

  it('stop resets runtime state', async () => {
    const { result } = renderHook(() => useRecognitionStore());

    act(() => {
      result.current.start('set-1', cards);
    });

    await waitFor(() => {
      expect(result.current.options).toEqual(['привет', 'мир', 'солнце']);
    });

    act(() => {
      result.current.answer('мир');
    });

    await waitFor(() => {
      expect(result.current.wrongCount).toBe(1);
    });

    act(() => {
      result.current.stop();
    });

    await waitFor(() => {
      expect(result.current.isActive).toBe(false);
      expect(result.current.isFinished).toBe(false);
      expect(result.current.feedback).toBe('idle');
      expect(result.current.locked).toBe(false);
      expect(result.current.options).toEqual([]);
      expect(result.current.disabled).toEqual({});
      expect(result.current.selected).toBeNull();
      expect(result.current.attempts).toBe(0);
      expect(result.current.wrongCount).toBe(0);
      expect(result.current.statsByCard).toEqual({});
    });
  });

  it('getStoredRecognition returns recognition stats from storage', () => {
    const recognitionStats = {
      totalCards: 5,
      completedCards: 4,
    };

    readPracticeStatsMock.mockReturnValue({
      recognition: recognitionStats,
      typing: { totalCards: 10 },
    });

    const { result } = renderHook(() => useRecognitionStore());

    expect(result.current.getStoredRecognition('set-1')).toEqual(recognitionStats);
    expect(readPracticeStatsMock).toHaveBeenCalledWith('set-1');
  });

  it('getStoredRecognition returns null when recognition stats are absent', () => {
    readPracticeStatsMock.mockReturnValue({
      typing: { totalCards: 10 },
    });

    const { result } = renderHook(() => useRecognitionStore());

    expect(result.current.getStoredRecognition('set-1')).toBeNull();
  });
});