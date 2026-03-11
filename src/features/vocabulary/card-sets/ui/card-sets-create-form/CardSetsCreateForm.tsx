import type { useCardSets } from '@/features/vocabulary/card-sets/model/use-card-sets.ts';
import { Button, Input } from '@/shared/ui';

import style from '../CardSets.module.scss';

type CardSetsModel = ReturnType<typeof useCardSets>;

type Props = Pick<
  CardSetsModel,
  'registerCreate' | 'handleSubmitCreate' | 'submitCreate' | 'createErrors' | 'isCreating'
>;

export function CardSetsCreateForm({
                                     registerCreate,
                                     handleSubmitCreate,
                                     submitCreate,
                                     createErrors,
                                     isCreating,
                                   }: Props) {
  return (
    <div className={style.sectionCreateCardSet}>
      <h2 className={style.title}>Create Card Set</h2>

      <form onSubmit={handleSubmitCreate(submitCreate)}>
        <div className={style.formRow}>
          <div className={style.formField}>
            <span className={style.label}>Title</span>
            <Input
              placeholder={'Travel France'}
              {...registerCreate('title', { required: true })}
            />
            {createErrors.title && <span className={style.error}>Title is required</span>}
          </div>

          <div className={style.formField}>
            <span className={style.label}>Description</span>
            <Input placeholder={'Short note'} {...registerCreate('description')} />
          </div>

          <div className={style.buttonContainer}>
            <Button
              title={isCreating ? 'Creating...' : 'Create'}
              type={'submit'}
              disabled={isCreating}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      </form>
    </div>
  );
}