import type { ContextStats } from '@/features/vocabulary/card-practice/context/model/context.types.ts';
import { writePracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage.ts';

export function writeContextStats(cardSetId: string, context: ContextStats) {
  writePracticeModeStats(cardSetId, 'context', context);
}
