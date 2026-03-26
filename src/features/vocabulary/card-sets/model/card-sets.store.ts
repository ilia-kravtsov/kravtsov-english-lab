import { createGStore } from 'create-gstore';
import { useState } from 'react';

import type { CardSet } from '@/entities/card-set/model/card-set.types';
import type { CardSetsState } from '@/features/vocabulary/card-sets/model/card-sets.types';

export const useCardSetsStore = createGStore<CardSetsState>(() => {
  const [sets, setSetsState] = useState<CardSet[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const setSets = (next: CardSet[]) => {
    setSetsState(next);
    setSelectedId((prev) => {
      if (prev && next.some((s) => s.id === prev)) return prev;
      return next[0]?.id ?? null;
    });
  };

  const removeFromState = (id: string) => {
    setSetsState((prev) => prev.filter((s) => s.id !== id));
    setSelectedId((prev) => (prev === id ? null : prev));
  };

  const upsertInState = (set: CardSet) => {
    setSetsState((prev) => {
      const idx = prev.findIndex((x) => x.id === set.id);
      if (idx === -1) return [set, ...prev];
      const copy = prev.slice();
      copy[idx] = set;
      return copy;
    });
    setSelectedId(set.id);
  };


  return {
    sets,
    selectedId,
    isLoading,
    setSets,
    setLoading: setIsLoading,
    select: setSelectedId,
    removeFromState,
    upsertInState,
  };
});
