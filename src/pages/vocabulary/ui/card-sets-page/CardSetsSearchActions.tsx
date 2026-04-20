import { hugeButtonStyles } from '@/shared/lib/styles/button.styles';
import { Button } from '@/shared/ui';

import style from './CardSetsPage.module.scss';

type Props = {
  inSet: boolean;
  adding: boolean;
  removing: boolean;
  hasFoundCardInSet: boolean;
  onAdd: () => void;
  onRemove: () => void;
};

export function CardSetsSearchActions({
  inSet,
  adding,
  removing,
  hasFoundCardInSet,
  onAdd,
  onRemove,
}: Props) {
  return (
    <div className={style.buttonBox}>
      <Button
        type={'button'}
        title={inSet ? 'Already added' : adding ? 'Adding...' : 'Add'}
        disabled={adding || inSet}
        onClick={onAdd}
        style={hugeButtonStyles}
      />

      <Button
        type={'button'}
        title={removing ? 'Removing...' : 'Remove'}
        disabled={removing || !hasFoundCardInSet}
        onClick={onRemove}
        style={hugeButtonStyles}
      />
    </div>
  );
}
