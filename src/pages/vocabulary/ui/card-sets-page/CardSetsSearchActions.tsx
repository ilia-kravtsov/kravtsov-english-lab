import { wideButtonStyles } from '@/shared/lib/styles/button.styles';
import { Button } from '@/shared/ui';

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
    <div style={{ display: 'flex', gap: '12px' }}>
      <Button
        type={'button'}
        title={inSet ? 'Already added' : adding ? 'Adding...' : 'Add'}
        disabled={adding || inSet}
        onClick={onAdd}
        style={wideButtonStyles}
      />

      <Button
        type={'button'}
        title={removing ? 'Removing...' : 'Remove'}
        disabled={removing || !hasFoundCardInSet}
        onClick={onRemove}
        style={wideButtonStyles}
      />
    </div>
  );
}
