import { writePracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage';
import type { PracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.types';

export function writeTypingStats(cardSetId: string, typing: PracticeModeStats) {
  writePracticeModeStats(cardSetId, 'typing', typing);
}
