import { useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { deleteLexicalUnit } from '@/entities/lexical-unit/api/lexical-unit.api';
import { useLexicalUnitEditorStore } from './lexicalUnitEditor.store';
import { useLexicalUnitSearch } from './useLexicalUnitSearch';

export function useSearchLexicalUnit() {
  const openAddWithValue = useLexicalUnitEditorStore(s => s.openAddWithValue);
  const openUpdate = useLexicalUnitEditorStore(s => s.openUpdate);

  const {
    query,
    setQuery,
    normalizedQuery,
    result,
    runSearch,
    audioRef,
    audioSrc,
    playAudio,
    imageSrc,
  } = useLexicalUnitSearch();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const canAdd = useMemo(() => result.status === 'not-found' && !!normalizedQuery, [result, normalizedQuery]);

  const handleAdd = () => {
    if (!canAdd) return;
    openAddWithValue(normalizedQuery);
  };

  const handleUpdate = () => {
    if (result.status !== 'found') return;
    openUpdate(result.unit);
  };

  const handleDeleteClick = () => {
    if (result.status !== 'found') return;
    setConfirmOpen(true);
  };

  const cancelDelete = () => setConfirmOpen(false);

  const confirmDelete = async () => {
    if (result.status !== 'found') return;

    setDeleting(true);
    try {
      await deleteLexicalUnit(result.unit.id);
      setConfirmOpen(false);
      toast.success('Deleted');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return {
    query,
    setQuery,
    normalizedQuery,
    result,

    runSearch,

    handleAdd,
    handleUpdate,

    confirmOpen,
    deleting,
    handleDeleteClick,
    cancelDelete,
    confirmDelete,

    audioRef,
    audioSrc,
    playAudio,

    imageSrc,
  };
}