import { writePracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage.ts';
import type { PracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.types';

export function writeListeningStats(cardSetId: string, listening: PracticeModeStats) {
  writePracticeModeStats(cardSetId, 'listening', listening);
}
