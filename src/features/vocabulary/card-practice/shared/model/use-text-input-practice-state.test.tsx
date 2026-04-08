import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type {
  TextInputCardStat,
  TextInputFeedback,
  TextInputSessionCard,
} from './text-input-practice.types';
import { useTextInputPracticeState } from './use-text-input-practice-state';

type TestCard = TextInputSessionCard;
type TestFeedback = TextInputFeedback;
type TestStat = TextInputCardStat & { isCorrect?: boolean };

const cards: TestCard[] = [
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
      type: 'word',
      value: 'Hello',
      translation: 'Привет',
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
      type: 'word',
      value: 'World',
      translation: 'Мир',
    },
  },
];

describe('useTextInputPracticeState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(performance, 'now').mockReturnValue(1000);
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('initializes practice correctly with cards', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', cards);
    });

    expect(result.current.cardSetId).toBe('set-1');
    expect(result.current.cards).toEqual(cards);
    expect(result.current.index).toBe(0);
    expect(result.current.statsByCard).toEqual({});
    expect(result.current.isFinished).toBe(false);
    expect(result.current.isAvailable).toBe(true);
    expect(result.current.isActive).toBe(true);
    expect(result.current.feedback).toBe('idle');
    expect(result.current.locked).toBe(false);
    expect(result.current.input).toBe('');
    expect(result.current.attempts).toBe(0);
    expect(result.current.wrongCount).toBe(0);
  });

  it('marks practice unavailable and inactive when initialized with empty cards', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', []);
    });

    expect(result.current.cardSetId).toBe('set-1');
    expect(result.current.cards).toEqual([]);
    expect(result.current.isAvailable).toBe(false);
    expect(result.current.isActive).toBe(false);
    expect(result.current.isFinished).toBe(false);
    expect(result.current.index).toBe(0);
  });

  it('sets input only when practice is active, not finished and not locked', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.setInput('blocked');
    });
    expect(result.current.input).toBe('');

    act(() => {
      result.current.initPractice('set-1', cards);
    });

    act(() => {
      result.current.setInput('Hello');
    });
    expect(result.current.input).toBe('Hello');

    act(() => {
      result.current.submit();
    });

    expect(result.current.locked).toBe(true);
    expect(result.current.feedback).toBe('correct');

    act(() => {
      result.current.setInput('World');
    });
    expect(result.current.input).toBe('Hello');

    act(() => {
      result.current.restart();
    });

    act(() => {
      result.current.setInput('Again');
    });
    expect(result.current.input).toBe('Again');

    act(() => {
      result.current.setIsFinished(true);
    });

    act(() => {
      result.current.setInput('Blocked when finished');
    });
    expect(result.current.input).toBe('Again');
  });

  it('submits correct answer and stores stat', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', cards);
    });

    vi.mocked(performance.now).mockReturnValueOnce(1501);

    act(() => {
      result.current.setInput('  hello ');
    });

    act(() => {
      result.current.submit();
    });

    expect(result.current.attempts).toBe(1);
    expect(result.current.locked).toBe(true);
    expect(result.current.feedback).toBe('correct');

    expect(result.current.statsByCard).toEqual({
      'card-1': {
        cardId: 'card-1',
        lexicalUnitId: 'lu-1',
        attempts: 1,
        wrongCount: 0,
        timeMs: 501,
        isCorrect: true,
      },
    });
  });

  it('submits wrong answer, increments wrongCount and resets feedback after timeout', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', cards);
      result.current.setInput('wrong');
    });

    act(() => {
      result.current.submit();
    });

    expect(result.current.attempts).toBe(1);
    expect(result.current.feedback).toBe('wrong');
    expect(result.current.wrongCount).toBe(1);
    expect(result.current.locked).toBe(false);
    expect(result.current.statsByCard).toEqual({});

    act(() => {
      vi.advanceTimersByTime(259);
    });
    expect(result.current.feedback).toBe('wrong');

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.feedback).toBe('idle');
  });

  it('does nothing on submit when current card expected value is empty', () => {
    const writeStats = vi.fn();
    const invalidCards: TestCard[] = [
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
          type: 'word',
          value: '',
          translation: 'Пусто',
        },
      },
    ];

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', invalidCards);
      result.current.setInput('anything');
    });

    act(() => {
      result.current.submit();
    });

    expect(result.current.attempts).toBe(0);
    expect(result.current.feedback).toBe('idle');
    expect(result.current.locked).toBe(false);
    expect(result.current.statsByCard).toEqual({});
  });

  it('does nothing on submit when card is already locked', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', cards);
      result.current.setLocked(true);
      result.current.setInput('hello');
    });

    act(() => {
      result.current.submit();
    });

    expect(result.current.attempts).toBe(0);
    expect(result.current.statsByCard).toEqual({});
  });

  it('skip stores skipped stat and moves to next card', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', cards);
      result.current.setAttempts(2);
      result.current.setWrongCount(1);
    });

    vi.mocked(performance.now).mockReturnValueOnce(1800);

    act(() => {
      result.current.skip();
    });

    expect(result.current.index).toBe(1);
    expect(result.current.feedback).toBe('idle');
    expect(result.current.locked).toBe(false);
    expect(result.current.input).toBe('');
    expect(result.current.attempts).toBe(0);
    expect(result.current.wrongCount).toBe(0);

    expect(result.current.statsByCard).toEqual({
      'card-1': {
        cardId: 'card-1',
        lexicalUnitId: 'lu-1',
        attempts: 2,
        wrongCount: 1,
        timeMs: 800,
        isCorrect: false,
        skipped: true,
      },
    });

    expect(writeStats).not.toHaveBeenCalled();
  });

  it('skip on last card finishes practice and writes aggregated stats', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', [cards[0]]);
      result.current.setAttempts(1);
      result.current.setWrongCount(2);
    });

    vi.mocked(performance.now).mockReturnValueOnce(1750);

    act(() => {
      result.current.skip();
    });

    expect(result.current.isFinished).toBe(true);
    expect(writeStats).toHaveBeenCalledTimes(1);
    expect(writeStats).toHaveBeenCalledWith('set-1', {
      totalCards: 1,
      completedCards: 1,
      firstTryCorrectCards: 0,
      wrongAnswers: 2,
      skippedCards: 1,
      totalAnswers: 1,
      correctAnswers: 0,
      avgTimeMs: 750,
    });
  });

  it('does nothing on skip when card is locked', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', cards);
      result.current.setLocked(true);
    });

    act(() => {
      result.current.skip();
    });

    expect(result.current.index).toBe(0);
    expect(result.current.statsByCard).toEqual({});
    expect(writeStats).not.toHaveBeenCalled();
  });

  it('next does nothing when current card is not locked', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', cards);
    });

    act(() => {
      result.current.next();
    });

    expect(result.current.index).toBe(0);
    expect(writeStats).not.toHaveBeenCalled();
  });

  it('next moves to next card and resets card-local state when locked', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', cards);
      result.current.setLocked(true);
      result.current.setFeedback('correct');
      result.current.setInputState('value');
      result.current.setAttempts(3);
      result.current.setWrongCount(2);
    });

    act(() => {
      result.current.next();
    });

    expect(result.current.index).toBe(1);
    expect(result.current.feedback).toBe('idle');
    expect(result.current.locked).toBe(false);
    expect(result.current.input).toBe('');
    expect(result.current.attempts).toBe(0);
    expect(result.current.wrongCount).toBe(0);
  });

  it('next on last locked card finishes practice and writes stats', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', [cards[0]]);
      result.current.setStatsByCard({
        'card-1': {
          cardId: 'card-1',
          lexicalUnitId: 'lu-1',
          attempts: 1,
          wrongCount: 0,
          timeMs: 400,
          isCorrect: true,
        },
      });
      result.current.setLocked(true);
    });

    act(() => {
      result.current.next();
    });

    expect(result.current.isFinished).toBe(true);
    expect(writeStats).toHaveBeenCalledWith('set-1', {
      totalCards: 1,
      completedCards: 1,
      firstTryCorrectCards: 1,
      wrongAnswers: 0,
      skippedCards: 0,
      totalAnswers: 1,
      correctAnswers: 1,
      avgTimeMs: 400,
    });
  });

  it('restart resets progress and reactivates practice when cards exist', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', cards);
      result.current.setIndex(1);
      result.current.setStatsByCard({
        'card-1': {
          cardId: 'card-1',
          lexicalUnitId: 'lu-1',
          attempts: 2,
          wrongCount: 1,
          timeMs: 300,
          isCorrect: true,
        },
      });
      result.current.setIsFinished(true);
      result.current.setIsActive(false);
      result.current.setFeedback('correct');
      result.current.setLocked(true);
      result.current.setInputState('abc');
      result.current.setAttempts(2);
      result.current.setWrongCount(1);
    });

    act(() => {
      result.current.restart();
    });

    expect(result.current.index).toBe(0);
    expect(result.current.statsByCard).toEqual({});
    expect(result.current.isFinished).toBe(false);
    expect(result.current.isActive).toBe(true);
    expect(result.current.feedback).toBe('idle');
    expect(result.current.locked).toBe(false);
    expect(result.current.input).toBe('');
    expect(result.current.attempts).toBe(0);
    expect(result.current.wrongCount).toBe(0);
  });

  it('restart marks practice unavailable when there are no cards', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.setCardSetId('set-1');
      result.current.setCards([]);
      result.current.setIsAvailable(true);
    });

    act(() => {
      result.current.restart();
    });

    expect(result.current.isAvailable).toBe(false);
  });

  it('stop resets runtime state', () => {
    const writeStats = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeState<TestCard, TestFeedback, TestStat>('idle', writeStats),
    );

    act(() => {
      result.current.initPractice('set-1', cards);
      result.current.setIsFinished(true);
      result.current.setFeedback('correct');
      result.current.setLocked(true);
      result.current.setInputState('hello');
      result.current.setAttempts(3);
      result.current.setWrongCount(2);
      result.current.setStatsByCard({
        'card-1': {
          cardId: 'card-1',
          lexicalUnitId: 'lu-1',
          attempts: 3,
          wrongCount: 2,
          timeMs: 500,
          isCorrect: true,
        },
      });
    });

    act(() => {
      result.current.stop();
    });

    expect(result.current.isActive).toBe(false);
    expect(result.current.isFinished).toBe(false);
    expect(result.current.feedback).toBe('idle');
    expect(result.current.locked).toBe(false);
    expect(result.current.input).toBe('');
    expect(result.current.attempts).toBe(0);
    expect(result.current.wrongCount).toBe(0);
    expect(result.current.statsByCard).toEqual({});
  });
});