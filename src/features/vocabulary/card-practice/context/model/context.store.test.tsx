import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CardWithLexicalUnit } from '@/entities/card';
import type { LexicalUnitType } from '@/entities/lexical-unit';

import { useContextStore } from './context.store';

const readPracticeStatsMock = vi.fn();
const pickContextExampleMock = vi.fn();

vi.mock('@/features/vocabulary/card-practice/shared/model/practice.storage', () => ({
  readPracticeStats: (...args: unknown[]) => readPracticeStatsMock(...args),
}));

vi.mock('./context.storage', () => ({
  writeContextStats: vi.fn(),
}));

vi.mock('./context.utils', () => ({
  pickContextExample: (...args: unknown[]) => pickContextExampleMock(...args),
}));

const WORD_TYPE = 'word' as LexicalUnitType;

const validCard: CardWithLexicalUnit = {
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
    examples: ['Hello, John!', 'Hello there!'],
  },
};

const noExamplesCard: CardWithLexicalUnit = {
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
    examples: [],
  },
};

const nullExamplesCard: CardWithLexicalUnit = {
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
    examples: null,
  },
};

const noLexicalUnitCard: CardWithLexicalUnit = {
  id: 'card-4',
  cardSetId: 'set-1',
  lexicalUnitId: 'lu-4',
  note: null,
  sortOrder: 3,
  createdAt: '2026-04-08T00:00:00.000Z',
  updatedAt: '2026-04-08T00:00:00.000Z',
  lexicalUnit: null,
};

const pickedContext = {
  example: 'Hello, John!',
  masked: '_____, John!',
};

describe('useContextStore', () => {
  beforeEach(() => {
    readPracticeStatsMock.mockReset();
    pickContextExampleMock.mockReset();
  });

  it('start keeps only valid context cards and enriches them with picked context data', async () => {
    pickContextExampleMock.mockImplementation((value: string) => {
      if (value === 'hello') return pickedContext;
      return null;
    });

    const { result } = renderHook(() => useContextStore());

    act(() => {
      result.current.start('set-1', [
        validCard,
        noExamplesCard,
        nullExamplesCard,
        noLexicalUnitCard,
      ]);
    });

    await waitFor(() => {
      expect(result.current.cardSetId).toBe('set-1');
    });

    await waitFor(() => {
      expect(result.current.cards).toEqual([
        {
          ...validCard,
          lexicalUnit: validCard.lexicalUnit!,
          contextExample: 'Hello, John!',
          contextMasked: '_____, John!',
        },
      ]);

      expect(result.current.index).toBe(0);
      expect(result.current.isAvailable).toBe(true);
      expect(result.current.isActive).toBe(true);
      expect(result.current.isFinished).toBe(false);
      expect(result.current.feedback).toBe('idle');
      expect(result.current.locked).toBe(false);
      expect(result.current.input).toBe('');
      expect(result.current.attempts).toBe(0);
      expect(result.current.wrongCount).toBe(0);
      expect(result.current.statsByCard).toEqual({});
    });

    expect(pickContextExampleMock).toHaveBeenCalledTimes(1);
    expect(pickContextExampleMock).toHaveBeenCalledWith('hello', ['Hello, John!', 'Hello there!']);
  });

  it('start makes practice unavailable when pickContextExample returns null for all candidates', async () => {
    pickContextExampleMock.mockReturnValue(null);

    const { result } = renderHook(() => useContextStore());

    act(() => {
      result.current.start('set-1', [validCard]);
    });

    await waitFor(() => {
      expect(result.current.cardSetId).toBe('set-1');
    });

    await waitFor(() => {
      expect(result.current.cards).toEqual([]);
      expect(result.current.index).toBe(0);
      expect(result.current.isAvailable).toBe(false);
      expect(result.current.isActive).toBe(false);
      expect(result.current.isFinished).toBe(false);
    });

    expect(pickContextExampleMock).toHaveBeenCalledTimes(1);
  });

  it('start makes practice unavailable when no valid cards remain after filtering', async () => {
    const { result } = renderHook(() => useContextStore());

    act(() => {
      result.current.start('set-1', [
        noExamplesCard,
        nullExamplesCard,
        noLexicalUnitCard,
      ]);
    });

    await waitFor(() => {
      expect(result.current.cardSetId).toBe('set-1');
    });

    await waitFor(() => {
      expect(result.current.cards).toEqual([]);
      expect(result.current.index).toBe(0);
      expect(result.current.isAvailable).toBe(false);
      expect(result.current.isActive).toBe(false);
      expect(result.current.isFinished).toBe(false);
    });

    expect(pickContextExampleMock).not.toHaveBeenCalled();
  });

  it('getStoredContext returns context stats from storage', () => {
    const contextStats = {
      totalCards: 6,
      completedCards: 4,
    };

    readPracticeStatsMock.mockReturnValue({
      context: contextStats,
      typing: { totalCards: 10 },
    });

    const { result } = renderHook(() => useContextStore());

    expect(result.current.getStoredContext('set-1')).toEqual(contextStats);
    expect(readPracticeStatsMock).toHaveBeenCalledWith('set-1');
  });

  it('getStoredContext returns null when context stats are absent', () => {
    readPracticeStatsMock.mockReturnValue({
      typing: { totalCards: 10 },
    });

    const { result } = renderHook(() => useContextStore());

    expect(result.current.getStoredContext('set-1')).toBeNull();
  });
});