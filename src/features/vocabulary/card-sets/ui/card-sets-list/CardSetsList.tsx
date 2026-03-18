import type { useCardSets } from '@/features/vocabulary/card-sets/model/use-card-sets.ts';
import { CardSetsListItem } from '@/features/vocabulary/card-sets/ui/card-sets-list-item/CardSetsListItem.tsx';

import style from '../CardSets.module.scss';

type CardSetsModel = ReturnType<typeof useCardSets>;
type CardSetItem = CardSetsModel['sets'][number];

type Props = {
  sets: CardSetsModel['sets'];
  selectedId: CardSetsModel['selectedId'];
  isLoading: CardSetsModel['isLoading'];
  onOpen: (id: string) => void;
  onEdit: (id: string | null) => void;
  onDelete: (set: CardSetItem) => void;
};

export function CardSetsList({ sets, selectedId, isLoading, onOpen, onEdit, onDelete }: Props) {
  return (
    <div className={style.sectionYourCardSets}>
      <div className={style.headerRow}>
        <h2 className={style.title}>Your Card Sets</h2>
      </div>

      {isLoading && <div className={style.muted}>Loading...</div>}

      {!isLoading && sets.length === 0 && <div className={style.muted}>No card sets yet</div>}

      {!isLoading && sets.length > 0 && (
        <div className={style.list}>
          {sets.map((item) => (
            <CardSetsListItem
              key={item.id}
              item={item}
              active={item.id === selectedId}
              onOpen={() => onOpen(item.id)}
              onEdit={() => onEdit(item.id)}
              onDelete={() => onDelete(item)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
