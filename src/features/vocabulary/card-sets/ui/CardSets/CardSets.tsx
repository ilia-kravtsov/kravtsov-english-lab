import style from './CardSets.module.scss';
import { Button, ConfirmModal, Input } from '@/shared/ui';
import { useCardSets } from '../../model/useCardSets.ts';
import { useNavigate } from 'react-router-dom';

export function CardSets() {
  const navigate = useNavigate();
  const {
    sets,
    selectedId,
    selected,
    isLoading,
    select,

    registerCreate,
    handleSubmitCreate,
    submitCreate,
    createErrors,
    isCreating,

    registerEdit,
    handleSubmitEdit,
    submitEdit,
    editErrors,
    isEditing,

    deleteTarget,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useCardSets();

  return (
    <div className={style.container}>
      <div className={style.sectionContainer}>
        <div className={style.sectionCreateCardSet}>
          <h2 className={style.title}>Create Card Set</h2>
          <form onSubmit={handleSubmitCreate(submitCreate)}>
            <div className={style.formRow}>
              <div className={style.formField}>
                <span className={style.label}>Title</span>
                <Input placeholder={'Travel France'} {...registerCreate('title', { required: true })} />
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
        {selectedId &&
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
          </div>}
      </div>

      <div className={style.sectionYourCardSets}>
        <div className={style.headerRow}>
          <h2 className={style.title}>Your Card Sets</h2>
        </div>

        {isLoading && <div className={style.muted}>Loading...</div>}

        {!isLoading && sets.length === 0 && <div className={style.muted}>No card sets yet</div>}

        {!isLoading && sets.length > 0 && (
          <div className={style.list}>
            {sets.map(s => {
              const active = s.id === selectedId;

              return (
                <div
                  key={s.id}
                  className={`${style.item} ${active ? style.itemActive : ''}`}
                  onClick={() => navigate(`/vocabulary/cards/${s.id}`)}
                  role={'button'}
                  tabIndex={0}
                >
                  <div className={style.itemDesc}>{s.description}</div>
                  <div className={style.itemTitle}>
                    {s.title}
                  </div>
                  <div className={style.itemActions} onClick={e => e.stopPropagation()}>
                    <Button
                      title={'Edit'}
                      onClick={() => select(s.id)}
                      style={{ width: '100px'}}
                    />
                    <Button
                      title={'Delete'}
                      onClick={() => requestDelete(s)}
                      style={{ width: '100px'}}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteTarget != null}
        title={'Delete card set?'}
        message={deleteTarget ? `Delete "${deleteTarget.title}"? All cards inside will be deleted.` : undefined}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
