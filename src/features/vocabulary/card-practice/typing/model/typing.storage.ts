import { writePracticeModeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage.ts';
import type { TypingStats } from '@/features/vocabulary/card-practice/typing/model/typing.types.ts';

export function writeTypingStats(cardSetId: string, typing: TypingStats) {
  writePracticeModeStats(cardSetId, 'typing', typing);
}
