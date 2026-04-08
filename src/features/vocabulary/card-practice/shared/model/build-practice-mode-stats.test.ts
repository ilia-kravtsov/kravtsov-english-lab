import { describe, expect, it } from 'vitest';

import { buildPracticeModeStats } from './build-practice-mode-stats.ts';

describe('buildPracticeModeStats', () => {
  it('returns zeroed derived stats for empty statsByCard', () => {
    const result = buildPracticeModeStats(5, {});

    expect(result).toEqual({
      totalCards: 5,
      completedCards: 0,
      firstTryCorrectCards: 0,
      wrongAnswers: 0,
      skippedCards: 0,
      totalAnswers: 0,
      correctAnswers: 0,
      avgTimeMs: 0,
    });
  });

  it('builds aggregated stats for mixed practice results', () => {
    const result = buildPracticeModeStats(4, {
      card1: {
        attempts: 1,
        wrongCount: 0,
        isCorrect: true,
        skipped: false,
        timeMs: 1000,
      },
      card2: {
        attempts: 3,
        wrongCount: 2,
        isCorrect: true,
        skipped: false,
        timeMs: 2300,
      },
      card3: {
        attempts: 1,
        wrongCount: 0,
        isCorrect: false,
        skipped: true,
        timeMs: 700,
      },
    });

    expect(result).toEqual({
      totalCards: 4,
      completedCards: 3,
      firstTryCorrectCards: 1,
      wrongAnswers: 2,
      skippedCards: 1,
      totalAnswers: 5,
      correctAnswers: 2,
      avgTimeMs: 1333,
    });
  });

  it('rounds average time in milliseconds', () => {
    const result = buildPracticeModeStats(2, {
      card1: {
        attempts: 1,
        wrongCount: 0,
        isCorrect: true,
        timeMs: 1000,
      },
      card2: {
        attempts: 1,
        wrongCount: 0,
        isCorrect: true,
        timeMs: 1001,
      },
    });

    expect(result.avgTimeMs).toBe(1001);
  });
});