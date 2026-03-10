import type { KeyboardEvent } from 'react';

import type { useCardSets } from '@/features/vocabulary/card-sets/model/useCardSets.ts';
import { Button } from '@/shared/ui';
import { mediumButtonStyles } from '@/shared/ui/ButtonStyles/button.styles.ts';

import style from '../CardSets.module.scss';

type CardSetsModel = ReturnType<typeof useCardSets>;
type CardSetItem = CardSetsModel['sets'][number];

type Props = {
  item: CardSetItem;
  active: boolean;
  onOpen: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export function CardSetsListItem({
                                   item,
                                   active,
                                   onOpen,
                                   onEdit,
                                   onDelete,
                                 }: Props) {
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen();
    }
  }

  return (
    <div
      className={`${style.item} ${active ? style.itemActive : ''}`}
      onClick={onOpen}
      onKeyDown={handleKeyDown}
      role={'button'}
      tabIndex={0}
    >
      <div className={style.itemDesc}>{item.description}</div>
      <div className={style.itemTitle}>{item.title}</div>
      <div className={style.itemCount}>{item.cardsCount} cards</div>

      <div className={style.itemActions} onClick={(e) => e.stopPropagation()}>
        <Button title={'Edit'} onClick={onEdit} style={mediumButtonStyles} />
        <Button title={'Delete'} onClick={onDelete} style={mediumButtonStyles} />
      </div>
    </div>
  );
}