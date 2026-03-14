import type { PracticeMode } from '@/features/vocabulary/card-practice/shared/model/practice-mode.types.ts';

const key = (cardSetId: string) => `practiceStats:${cardSetId}`;

export function readPracticeStats(cardSetId: string) {
  try {
    const raw = localStorage.getItem(key(cardSetId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch {
    return {};
  }
}

export function writePracticeModeStats(cardSetId: string, mode: PracticeMode, stats: unknown) {
  const current = readPracticeStats(cardSetId);

  const next = {
    ...current,
    [mode]: stats,
  };

  localStorage.setItem(key(cardSetId), JSON.stringify(next));
}
