import { writePracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage.ts';
import type { PracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.types.ts';

export function writeTypingStats(cardSetId: string, typing: PracticeModeStats) {
  writePracticeModeStats(cardSetId, 'typing', typing);
}
