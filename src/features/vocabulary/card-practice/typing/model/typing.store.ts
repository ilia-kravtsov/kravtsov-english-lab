import { createGStore } from 'create-gstore';

import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import { readPracticeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage.ts';
import type {
  GetStoredPracticeModeStats,
  TextInputCardStat,
  TextInputFeedback,
  TextInputPracticeState,
  TextInputSessionCard,
} from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types.ts';
import { useTextInputPracticeState } from '@/features/vocabulary/card-practice/shared/model/use-text-input-practice-state.ts';

import { writeTypingStats } from './typing.storage';

interface TypingState extends TextInputPracticeState<
  TextInputSessionCard,
  TextInputFeedback,
  TextInputCardStat
> {
  getStoredTyping: GetStoredPracticeModeStats;
}

export const useTypingStore = createGStore<TypingState>(() => {
  const {
    cardSetId,
    isAvailable,
    isActive,
    isFinished,
    cards,
    index,
    feedback,
    locked,
    input,
    attempts,
    wrongCount,
    statsByCard,
    initPractice,
    stop,
    setInput,
    submit,
    skip,
    next,
    restart,
  } = useTextInputPracticeState<TextInputSessionCard, TextInputFeedback, TextInputCardStat>(
    'idle',
    writeTypingStats,
  );

  const start = (id: string, allCards: CardWithLexicalUnit[]) => {
    const filtered = allCards
      .filter((c) => c.lexicalUnit && (c.lexicalUnit.translation ?? '').trim().length > 0)
      .map((c) => c as TextInputSessionCard);

    initPractice(id, filtered);
  };

  const getStoredTyping = (id: string) => {
    const stored = readPracticeStats(id);
    return stored.typing ?? null;
  };

  return {
    cardSetId,

    isAvailable,
    isActive,
    isFinished,

    cards,
    index,

    feedback,
    locked,

    input,

    attempts,
    wrongCount,

    statsByCard,

    start,
    stop,

    setInput,
    submit,
    skip,
    next,
    restart,

    getStoredTyping,
  };
});
