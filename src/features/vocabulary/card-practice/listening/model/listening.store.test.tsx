import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CardWithLexicalUnit } from '@/entities/card';
import type { LexicalUnitType } from '@/entities/lexical-unit';

import { useListeningStore } from './listening.store';

const readPracticeStatsMock = vi.fn();

vi.mock('@/features/vocabulary/card-practice/shared/model/practice.storage.ts', () => ({
  readPracticeStats: (...args: unknown[]) => readPracticeStatsMock(...args),
}));

vi.mock('./listening.storage.ts', () => ({
  writeListeningStats: vi.fn(),
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
    audioUrl: 'https://example.com/audio-1.mp3',
  },
};

const emptyAudioCard: CardWithLexicalUnit = {
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
    audioUrl: '',
  },
};

const nullAudioCard: CardWithLexicalUnit = {
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
    audioUrl: null,
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

describe('useListeningStore', () => {
  beforeEach(() => {
    readPracticeStatsMock.mockReset();
  });

  it('start keeps only cards with audioUrl', async () => {
    const { result } = renderHook(() => useListeningStore());

    act(() => {
      result.current.start('set-1', [
        validCard,
        emptyAudioCard,
        nullAudioCard,
        noLexicalUnitCard,
      ]);
    });

    await waitFor(() => {
      expect(result.current.cardSetId).toBe('set-1');
    });

    await waitFor(() => {
      expect(result.current.cards).toEqual([validCard]);
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
  });

  it('start makes practice unavailable when no valid listening cards remain after filtering', async () => {
    const { result } = renderHook(() => useListeningStore());

    act(() => {
      result.current.start('set-1', [
        emptyAudioCard,
        nullAudioCard,
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
  });

  it('getStoredListening returns listening stats from storage', () => {
    const listeningStats = {
      totalCards: 7,
      completedCards: 5,
    };

    readPracticeStatsMock.mockReturnValue({
      listening: listeningStats,
      typing: { totalCards: 10 },
    });

    const { result } = renderHook(() => useListeningStore());

    expect(result.current.getStoredListening('set-1')).toEqual(listeningStats);
    expect(readPracticeStatsMock).toHaveBeenCalledWith('set-1');
  });

  it('getStoredListening returns null when listening stats are absent', () => {
    readPracticeStatsMock.mockReturnValue({
      typing: { totalCards: 10 },
    });

    const { result } = renderHook(() => useListeningStore());

    expect(result.current.getStoredListening('set-1')).toBeNull();
  });
});