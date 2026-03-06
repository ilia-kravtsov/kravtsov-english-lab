import type { PracticeModeStats } from './practice.types';

type CardStatLike = {
  attempts: number;
  wrongCount: number;
  isCorrect?: boolean;
  skipped?: boolean;
  timeMs?: number;
};

const round = (n: number) => Math.round(n);

export function buildPracticeModeStats<T extends CardStatLike>(
  totalCards: number,
  statsByCard: Record<string, T>,
): PracticeModeStats {
  const entries = Object.values(statsByCard);

  const completedCards = entries.length;
  const firstTryCorrectCards = entries.filter(s => s.isCorrect && !s.skipped && s.attempts === 1 && s.wrongCount === 0).length;
  const wrongAnswers = entries.reduce((acc, s) => acc + s.wrongCount, 0);
  const skippedCards = entries.filter(s => s.skipped).length;
  const totalAnswers = entries.reduce((acc, s) => acc + s.attempts, 0);
  const correctAnswers = entries.filter(s => s.isCorrect).length;
  const timeSum = entries.reduce((acc, s) => acc + (s.timeMs || 0), 0);
  const avgTimeMs = completedCards > 0 ? round(timeSum / completedCards) : 0;

  return {
    totalCards,
    completedCards,
    firstTryCorrectCards,
    wrongAnswers,
    skippedCards,
    totalAnswers,
    correctAnswers,
    avgTimeMs,
  };
}