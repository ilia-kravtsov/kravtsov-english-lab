import type { PracticeStats, ListeningStats } from './listening.types';

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

export function writeListeningStats(cardSetId: string, listening: ListeningStats) {
  const current = readPracticeStats(cardSetId);
  const next: PracticeStats = { ...current, listening };
  localStorage.setItem(key(cardSetId), JSON.stringify(next));
}