import type { useCardSets } from '@/features/vocabulary/card-sets/model/useCardSets.ts';
import { Button, Input } from '@/shared/ui';

import style from '../CardSets.module.scss';

type CardSetsModel = ReturnType<typeof useCardSets>;

type Props = Pick<
  CardSetsModel,
  'selectedId' | 'selected' | 'registerEdit' | 'handleSubmitEdit' | 'submitEdit' | 'editErrors' | 'isEditing'
>;

export function CardSetsEditForm({
                                   selectedId,
                                   selected,
                                   registerEdit,
                                   handleSubmitEdit,
                                   submitEdit,
                                   editErrors,
                                   isEditing,
                                 }: Props) {
  if (!selectedId) return null;

  return (
    <div className={style.sectionEdit}>
      <div className={style.headerRow}>
        <h2 className={style.title}>Edit Card Set</h2>
        <p>Click the Edit button on the Card Set to change the title and description</p>
      </div>

      {!selected && <div className={style.muted}>Select a card set</div>}

      {selected && (
        <form onSubmit={handleSubmitEdit(submitEdit)}>
          <div className={style.formRow}>
            <div className={style.formField}>
              <span className={style.label}>Title</span>
              <Input {...registerEdit('title', { required: true })} />
              {editErrors.title && <span className={style.error}>Title is required</span>}
            </div>

            <div className={style.formField}>
              <span className={style.label}>Description</span>
              <Input {...registerEdit('description')} />
            </div>

            <Button
              title={isEditing ? 'Saving...' : 'Save'}
              type={'submit'}
              disabled={isEditing}
            />
          </div>
        </form>
      )}
    </div>
  );
}