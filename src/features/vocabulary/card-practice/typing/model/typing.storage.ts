import type { TypingStats } from '@/features/vocabulary/card-practice/typing/model/typing.types.ts';
import { writePracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage.ts';

export function writeTypingStats(cardSetId: string, typing: TypingStats) {
  writePracticeModeStats(cardSetId, 'typing', typing);
}