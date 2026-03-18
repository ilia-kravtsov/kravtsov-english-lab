import type { CardSet } from '@/entities/card-set';

export interface CardSetsState {
  sets: CardSet[];
  selectedId: string | null;
  isLoading: boolean;

  setSets: (sets: CardSet[]) => void;
  setLoading: (v: boolean) => void;

  select: (id: string | null) => void;
  removeFromState: (id: string) => void;
  upsertInState: (set: CardSet) => void;
}
