import { writePracticeModeStats } from '../../shared/model/practice.storage';
import type { PracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.types.ts';

export function writeListeningStats(cardSetId: string, listening: PracticeModeStats) {
  writePracticeModeStats(cardSetId, 'listening', listening);
}