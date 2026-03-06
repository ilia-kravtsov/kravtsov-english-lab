import { useMemo } from 'react';
import type { CardWithLexicalUnit } from '@/entities/card/model/card.types.ts';
import { pickContextExample } from '@/features/vocabulary/card-practice/context/model/context.utils.ts';

type Params = {
  items: CardWithLexicalUnit[];
};

export function usePracticeModeAvailability({ items }: Params) {
  const recognitionAvailable = useMemo(() => {
    const count = items.filter(
      c => c.lexicalUnit && (c.lexicalUnit.translation ?? '').trim().length > 0
    ).length;

    return count >= 2;
  }, [items]);

  const typingAvailable = useMemo(() => {
    const count = items.filter(
      c => c.lexicalUnit && (c.lexicalUnit.translation ?? '').trim().length > 0
    ).length;

    return count >= 1;
  }, [items]);

  const contextAvailable = useMemo(() => {
    const count = items.filter(c => {
      const lu = c.lexicalUnit;

      if (!lu) return false;

      const ex = lu.examples ?? [];
      if (!ex.length) return false;

      return Boolean(pickContextExample(lu.value ?? '', ex));
    }).length;

    return count >= 1;
  }, [items]);

  const listeningAvailable = useMemo(() => {
    const count = items.filter(c => c.lexicalUnit && Boolean(c.lexicalUnit.audioUrl)).length;
    return count >= 1;
  }, [items]);

  return {
    recognitionAvailable,
    typingAvailable,
    contextAvailable,
    listeningAvailable,
  };
}