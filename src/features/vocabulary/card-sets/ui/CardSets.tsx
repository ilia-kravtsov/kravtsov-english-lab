import { useNavigate } from 'react-router-dom';

import { CardSetsCreateForm } from '@/features/vocabulary/card-sets/ui/card-sets-create-form/CardSetsCreateForm.tsx';
import { CardSetsEditForm } from '@/features/vocabulary/card-sets/ui/card-sets-edit-form/CardSetsEditForm.tsx';
import { CardSetsList } from '@/features/vocabulary/card-sets/ui/card-sets-list/CardSetsList.tsx';
import { ConfirmModal } from '@/shared/ui';

import { useCardSets } from '../model/use-card-sets.ts';
import style from './CardSets.module.scss';

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
        <CardSetsCreateForm
          registerCreate={registerCreate}
          handleSubmitCreate={handleSubmitCreate}
          submitCreate={submitCreate}
          createErrors={createErrors}
          isCreating={isCreating}
        />

        <CardSetsEditForm
          selectedId={selectedId}
          selected={selected}
          registerEdit={registerEdit}
          handleSubmitEdit={handleSubmitEdit}
          submitEdit={submitEdit}
          editErrors={editErrors}
          isEditing={isEditing}
        />
      </div>

      <CardSetsList
        sets={sets}
        selectedId={selectedId}
        isLoading={isLoading}
        onOpen={(id) => navigate(`/vocabulary/cards/${id}`)}
        onEdit={select}
        onDelete={requestDelete}
      />

      <ConfirmModal
        isOpen={deleteTarget != null}
        title={'Delete card set?'}
        message={
          deleteTarget
            ? `Delete "${deleteTarget.title}"? All cards inside will be deleted.`
            : undefined
        }
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
