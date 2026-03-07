import type { PracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.types';

import { writePracticeModeStats } from '../../shared/model/practice.storage';

export function writeListeningStats(cardSetId: string, listening: PracticeModeStats) {
  writePracticeModeStats(cardSetId, 'listening', listening);
}
