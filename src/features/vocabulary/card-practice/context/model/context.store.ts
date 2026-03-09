import { createGStore } from 'create-gstore';

import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import { readPracticeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage';
import type {
  GetStoredPracticeModeStats,
  TextInputCardStat,
  TextInputFeedback,
  TextInputPracticeState,
} from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types.ts';
import { useTextInputPracticeState } from '@/features/vocabulary/card-practice/shared/model/useTextInputPracticeState.ts';

import { writeContextStats } from './context.storage';
import type { ContextSessionCard } from './context.types';
import { pickContextExample } from './context.utils';

export interface ContextState extends TextInputPracticeState<
  ContextSessionCard,
  TextInputFeedback,
  TextInputCardStat
> {
  getStoredContext: GetStoredPracticeModeStats;
}

export const useContextStore = createGStore<ContextState>(() => {
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
  } = useTextInputPracticeState<ContextSessionCard, TextInputFeedback, TextInputCardStat>(
    'idle',
    writeContextStats,
  );

  const start = (id: string, allCards: CardWithLexicalUnit[]) => {
    const filtered = allCards
      .filter((c) => c.lexicalUnit)
      .map(
        (c) =>
          c as CardWithLexicalUnit & {
            lexicalUnit: NonNullable<CardWithLexicalUnit['lexicalUnit']>;
          },
      )
      .map((c) => {
        const lu = c.lexicalUnit;
        const examples = lu.examples ?? [];
        if (!examples.length) return null;
        const picked = pickContextExample(lu.value ?? '', examples);
        if (!picked) return null;
        const session: ContextSessionCard = {
          ...c,
          lexicalUnit: lu,
          contextExample: picked.example,
          contextMasked: picked.masked,
        };
        return session;
      })
      .filter(Boolean) as ContextSessionCard[];

    initPractice(id, filtered);
  };

  const getStoredContext = (id: string) => {
    const stored = readPracticeStats(id);
    return stored.context ?? null;
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

    getStoredContext,
  };
});
