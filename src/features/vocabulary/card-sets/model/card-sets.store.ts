import { create } from 'zustand/react';

import type { CardSetsState } from '@/features/vocabulary/card-sets/model/card-sets.types';

export const useCardSetsStore = create<CardSetsState>((set, get) => ({
  sets: [],
  selectedId: null,
  isLoading: false,

  setSets: (next) => {
    const prevSelectedId = get().selectedId;
    const nextSelectedId =
      prevSelectedId && next.some((s) => s.id === prevSelectedId)
        ? prevSelectedId
        : (next[0]?.id ?? null);

    set({
      sets: next,
      selectedId: nextSelectedId,
    });
  },

  setLoading: (value) =>
    set({
      isLoading: value,
    }),

  select: (id) =>
    set({
      selectedId: id,
    }),

  removeFromState: (id) => {
    const prev = get();
    const nextSets = prev.sets.filter((s) => s.id !== id);
    const nextSelectedId = prev.selectedId === id ? null : prev.selectedId;

    set({
      sets: nextSets,
      selectedId: nextSelectedId,
    });
  },

  upsertInState: (cardSet) => {
    const prevSets = get().sets;
    const idx = prevSets.findIndex((x) => x.id === cardSet.id);

    const nextSets =
      idx === -1
        ? [cardSet, ...prevSets]
        : prevSets.map((item, index) => (index === idx ? cardSet : item));

    set({
      sets: nextSets,
      selectedId: cardSet.id,
    });
  },
}));