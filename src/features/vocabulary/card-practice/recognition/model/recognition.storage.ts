import { writePracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage.ts';
import type { PracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.types.ts';

export function writeRecognitionStats(cardSetId: string, recognition: PracticeModeStats) {
  writePracticeModeStats(cardSetId, 'recognition', recognition);
}
