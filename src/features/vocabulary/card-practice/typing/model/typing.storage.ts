import type { PracticeStats, TypingStats } from './typing.types';

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

export function writeTypingStats(cardSetId: string, typing: TypingStats) {
  const current = readPracticeStats(cardSetId);
  const next: PracticeStats = { ...current, typing };
  localStorage.setItem(key(cardSetId), JSON.stringify(next));
}