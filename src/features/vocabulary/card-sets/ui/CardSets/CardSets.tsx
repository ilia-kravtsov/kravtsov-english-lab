import style from './CardSets.module.scss';
import { Button, ConfirmModal, Input } from '@/shared/ui';
import { useCardSets } from '../../model/useCardSets.ts';

export function CardSets() {
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

    reload,

    deleteTarget,
    requestDelete,
    cancelDelete,
    confirmDelete,
  } = useCardSets();

  return (
    <div className={style.container}>
      <div className={style.section}>
        <div className={style.headerRow}>
          <h2 className={style.title}>Create Card Set</h2>
          <Button title={isLoading ? 'Loading...' : 'Refresh'} onClick={reload} disabled={isLoading} />
        </div>

        <form onSubmit={handleSubmitCreate(submitCreate)}>
          <div className={style.formRow}>
            <div className={style.formField}>
              <span className={style.label}>Title (unique)</span>
              <Input placeholder={"Travel France"} {...registerCreate('title', { required: true })} />
              {createErrors.title && <span className={style.error}>Title is required</span>}
            </div>

            <div className={style.formField}>
              <span className={style.label}>Description (optional)</span>
              <Input placeholder={"Short note"} {...registerCreate('description')} />
            </div>

            <Button title={isCreating ? 'Creating...' : 'Create'} type={"submit"} disabled={isCreating} />
          </div>
        </form>
      </div>

      <div className={style.split}>
        <div className={style.section}>
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
                    onClick={() => select(s.id)}
                    role="button"
                    tabIndex={0}
                  >
                    <div className={style.itemMeta}>
                      <div className={style.itemTitle}>
                        {s.title}{s.isPreset ? ' (preset)' : ''}
                      </div>
                      <div className={style.itemDesc}>
                        key: {s.key}{s.description ? ` · ${s.description}` : ''}
                      </div>
                    </div>

                    <div className={style.itemActions} onClick={e => e.stopPropagation()}>
                      <Button title="Edit" onClick={() => select(s.id)} />
                      <Button title="Delete" onClick={() => requestDelete(s)} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className={style.section}>
          <div className={style.headerRow}>
            <h2 className={style.title}>Edit Selected</h2>
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

                <Button title={isEditing ? 'Saving...' : 'Save'} type="submit" disabled={isEditing} />
              </div>

              <div className={style.muted}>URL: /vocabulary/cards/{selected.key}</div>
            </form>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteTarget != null}
        title={"Delete card set?"}
        message={deleteTarget ? `Delete "${deleteTarget.title}"? All cards inside will be deleted.` : undefined}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
