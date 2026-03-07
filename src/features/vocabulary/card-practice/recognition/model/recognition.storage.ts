import { writePracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage';
import type { PracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.types';

export function writeRecognitionStats(cardSetId: string, recognition: PracticeModeStats) {
  writePracticeModeStats(cardSetId, 'recognition', recognition);
}
