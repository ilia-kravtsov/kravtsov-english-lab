import { useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { deleteLexicalUnit, searchLexicalUnitByValue } from '@/entities/lexical-unit/api/lexical-unit.api';
import type { LexicalUnit } from '@/entities/lexical-unit/model/lexical-unit.types';
import { useLexicalUnitEditorStore } from './lexicalUnitEditor.store';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type ResultState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'found'; unit: LexicalUnit };

export function useSearchLexicalUnit() {
  const openAddWithValue = useLexicalUnitEditorStore(s => s.openAddWithValue);
  const openUpdate = useLexicalUnitEditorStore(s => s.openUpdate);

  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ResultState>({ status: 'idle' });

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const normalizedQuery = useMemo(() => query.trim(), [query]);

  const audioSrc = useMemo(() => {
    if (result.status !== 'found') return null;

    const url = result.unit.audioUrl;
    if (!url) return null;

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `${apiBaseUrl}${url}`;
  }, [result]);

  const imageSrc = useMemo(() => {
    if (result.status !== 'found') {
      return null;
    }

    const url = result.unit.imageUrl;

    if (!url) {
      return null;
    }

    return url;
  }, [result]);

  const runSearch = async () => {
    const value = normalizedQuery;
    if (!value) {
      setResult({ status: 'idle' });
      return;
    }

    setResult({ status: 'loading' });
    try {
      const data = await searchLexicalUnitByValue(value);
      if (!data) {
        setResult({ status: 'not-found' });
        return;
      }
      setResult({ status: 'found', unit: data });
    } catch (e) {
      console.error(e);
      setResult({ status: 'not-found' });
    }
  };

  const handleAdd = () => {
    const value = normalizedQuery;
    if (!value) return;
    openAddWithValue(value);
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
      setResult({ status: 'not-found' });
      toast.success('Deleted');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    void audioRef.current.play();
  };

  return {
    // state
    query,
    setQuery,
    normalizedQuery,
    result,

    // search
    runSearch,

    // actions
    handleAdd,
    handleUpdate,

    // delete modal
    confirmOpen,
    deleting,
    handleDeleteClick,
    cancelDelete,
    confirmDelete,

    // audio
    audioRef,
    audioSrc,
    playAudio,

    // image
    imageSrc
  };
}
