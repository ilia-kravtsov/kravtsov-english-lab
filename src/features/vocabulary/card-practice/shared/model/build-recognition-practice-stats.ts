import type { PracticeModeStats } from './practice.types';

type RecognitionCardStatLike = {
  attempts: number;
  wrongCount: number;
  timeMs?: number;
};

const round = (n: number) => Math.round(n);

export function buildRecognitionPracticeStats<T extends RecognitionCardStatLike>(
  totalCards: number,
  statsByCard: Record<string, T>,
): PracticeModeStats {
  const entries = Object.values(statsByCard);

  const completedCards = entries.length;
  const firstTryCorrectCards = entries.filter(s => s.attempts === 1 && s.wrongCount === 0,).length;
  const wrongAnswers = entries.reduce((acc, s) => acc + s.wrongCount, 0);
  const skippedCards = 0;
  const totalAnswers = entries.reduce((acc, s) => acc + s.attempts, 0);
  const correctAnswers = completedCards;
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