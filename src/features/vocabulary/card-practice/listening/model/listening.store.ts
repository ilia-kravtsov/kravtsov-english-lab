import { createGStore } from 'create-gstore';

import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import { readPracticeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage';
import type {
  GetStoredPracticeModeStats,
  TextInputCardStat,
  TextInputFeedback,
  TextInputPracticeState,
  TextInputSessionCard,
} from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types.ts';
import { useTextInputPracticeState } from '@/features/vocabulary/card-practice/shared/model/use-text-input-practice-state.ts';

import { writeListeningStats } from './listening.storage';

export interface ListeningState extends TextInputPracticeState<
  TextInputSessionCard,
  TextInputFeedback,
  TextInputCardStat
> {
  getStoredListening: GetStoredPracticeModeStats;
}

export const useListeningStore = createGStore<ListeningState>(() => {
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
    writeListeningStats,
  );

  const start = (id: string, allCards: CardWithLexicalUnit[]) => {
    const filtered = allCards
      .filter((c) => c.lexicalUnit && Boolean(c.lexicalUnit.audioUrl))
      .map((c) => c as TextInputSessionCard);

    initPractice(id, filtered);
  };

  const getStoredListening = (id: string) => {
    const stored = readPracticeStats(id);
    return stored.listening ?? null;
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

    getStoredListening,
  };
});
