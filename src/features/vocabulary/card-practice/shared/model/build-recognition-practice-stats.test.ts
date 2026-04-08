import { describe, expect, it } from 'vitest';

import { buildRecognitionPracticeStats } from './build-recognition-practice-stats';

describe('buildRecognitionPracticeStats', () => {
  it('returns zeroed stats for empty input', () => {
    const result = buildRecognitionPracticeStats(5, {});

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

  it('builds aggregated stats correctly', () => {
    const result = buildRecognitionPracticeStats(4, {
      card1: {
        attempts: 1,
        wrongCount: 0,
        timeMs: 1000,
      },
      card2: {
        attempts: 3,
        wrongCount: 2,
        timeMs: 2000,
      },
      card3: {
        attempts: 2,
        wrongCount: 1,
        timeMs: 1500,
      },
    });

    expect(result).toEqual({
      totalCards: 4,
      completedCards: 3,
      firstTryCorrectCards: 1,
      wrongAnswers: 3,
      skippedCards: 0,
      totalAnswers: 6,
      correctAnswers: 3,
      avgTimeMs: 1500,
    });
  });

  it('counts first try correct cards correctly', () => {
    const result = buildRecognitionPracticeStats(3, {
      card1: { attempts: 1, wrongCount: 0 },
      card2: { attempts: 1, wrongCount: 0 },
      card3: { attempts: 2, wrongCount: 1 },
    });

    expect(result.firstTryCorrectCards).toBe(2);
  });

  it('handles missing timeMs as 0', () => {
    const result = buildRecognitionPracticeStats(2, {
      card1: { attempts: 1, wrongCount: 0, timeMs: 1000 },
      card2: { attempts: 1, wrongCount: 0 },
    });

    expect(result.avgTimeMs).toBe(500);
  });

  it('rounds average time correctly', () => {
    const result = buildRecognitionPracticeStats(2, {
      card1: { attempts: 1, wrongCount: 0, timeMs: 1000 },
      card2: { attempts: 1, wrongCount: 0, timeMs: 1001 },
    });

    expect(result.avgTimeMs).toBe(1001);
  });
});