import type { ContextStats, PracticeStats } from './context.types';

const key = (cardSetId: string) => `practiceStats:${cardSetId}`;

export function readPracticeStats(cardSetId: string): PracticeStats {
  try {
    const raw = localStorage.getItem(key(cardSetId));
    if (!raw) return {};
    const parsed = JSON.parse(raw) as PracticeStats;
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

export function writeContextStats(cardSetId: string, context: ContextStats) {
  const current = readPracticeStats(cardSetId);
  const next: PracticeStats = { ...current, context };
  localStorage.setItem(key(cardSetId), JSON.stringify(next));
}
