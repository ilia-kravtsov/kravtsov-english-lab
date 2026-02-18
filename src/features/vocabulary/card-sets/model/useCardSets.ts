import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useCardSetsStore } from '@/features/vocabulary/card-sets/model/card-sets.store.ts';
import type { CardSet, CreateCardSetPayload, UpdateCardSetPayload } from '@/entities/card-set/model/card-set.types.ts';
import { createCardSet, deleteCardSet, getCardSets, updateCardSet } from '@/entities/card-set/api/card-set.api.ts';
import { extractErrorMessage } from '@/shared/lib/extractErrorMessage.ts';

type CreateFormValues = {
  title: string;
  description: string;
};

type EditFormValues = {
  title: string;
  description: string;
};

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

export function useCardSets() {
  const sets = useCardSetsStore(s => s.sets);
  const selectedId = useCardSetsStore(s => s.selectedId);
  const isLoading = useCardSetsStore(s => s.isLoading);

  const setSets = useCardSetsStore(s => s.setSets);
  const setLoading = useCardSetsStore(s => s.setLoading);
  const select = useCardSetsStore(s => s.select);
  const removeFromState = useCardSetsStore(s => s.removeFromState);
  const upsertInState = useCardSetsStore(s => s.upsertInState);

  const selected = useMemo<CardSet | null>(
    () => sets.find(s => s.id === selectedId) ?? null,
    [sets, selectedId],
  );

  const [deleteTarget, setDeleteTarget] = useState<CardSet | null>(null);
  const didInitRef = useRef(false);

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors, isSubmitting: isCreating },
  } = useForm<CreateFormValues>({ defaultValues: { title: '', description: '' } });

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors, isSubmitting: isEditing },
  } = useForm<EditFormValues>({ defaultValues: { title: '', description: '' } });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCardSets();
      setSets(data);
    } catch (e) {
      toast.error(extractErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [setLoading, setSets]);

  useEffect(() => {
    if (didInitRef.current) return;
    didInitRef.current = true;
    void load();
  }, []);

  useEffect(() => {
    if (!selected) {
      resetEdit({ title: '', description: '' });
      return;
    }
    resetEdit({
      title: selected.title,
      description: selected.description ?? '',
    });
  }, [selected, resetEdit]);

  const submitCreate: SubmitHandler<CreateFormValues> = async values => {
    const payload: CreateCardSetPayload = {
      title: normalizeText(values.title),
      description: values.description.trim() || undefined,
    };

    try {
      const created = await createCardSet(payload);
      toast.success('Card set created');
      resetCreate({ title: '', description: '' });

      await load();
      select(created.id);
    } catch (e) {
      toast.error(extractErrorMessage(e));
    }
  };

  const submitEdit: SubmitHandler<EditFormValues> = async values => {
    if (!selected) return;

    const payload: UpdateCardSetPayload = {
      title: normalizeText(values.title),
      description: values.description.trim() || undefined,
    };

    try {
      const updated = await updateCardSet(selected.id, payload);
      toast.success('Card set updated');

      upsertInState(updated);
    } catch (e) {
      toast.error(extractErrorMessage(e));
    }
  };

  const requestDelete = (set: CardSet) => setDeleteTarget(set);
  const cancelDelete = () => setDeleteTarget(null);

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteCardSet(deleteTarget.id);
      const next = sets.filter(s => s.id !== deleteTarget.id);
      toast.success('Card set deleted');

      removeFromState(deleteTarget.id);
      setDeleteTarget(null);

      select(next[0]?.id ?? null);
    } catch (e) {
      toast.error(extractErrorMessage(e));
      setDeleteTarget(null);
    }
  };

  return {
    // state
    sets,
    selectedId,
    selected,
    isLoading,

    // selection
    select,

    // create form
    registerCreate,
    handleSubmitCreate,
    submitCreate,
    createErrors,
    isCreating,

    // edit form
    registerEdit,
    handleSubmitEdit,
    submitEdit,
    editErrors,
    isEditing,

    // actions
    reload: load,

    // delete modal
    deleteTarget,
    requestDelete,
    cancelDelete,
    confirmDelete,
  };
}
