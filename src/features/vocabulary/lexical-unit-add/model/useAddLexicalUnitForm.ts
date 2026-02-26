import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

import type { AddLexicalUnitFormValues, PartsOfSpeech } from '@/entities/lexical-unit/model/lexical-unit.types';
import { addLexicalUnit, updateLexicalUnit } from '@/entities/lexical-unit/api/lexical-unit.api';
import { useLexicalUnitEditorStore } from './lexicalUnitEditor.store';
import { useAudioRecorder } from './useAudioRecorder';

type FormValues = Omit<AddLexicalUnitFormValues, 'type' | 'examples'> & { examples: string[] };

function normalizeValue(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function computeTypeByValue(value: string): AddLexicalUnitFormValues['type'] {
  const v = normalizeValue(value);
  return v.includes(' ') ? 'expression' : 'word';
}

function ensureAtLeastOne(v?: string[] | null) {
  if (!v || v.length === 0) return [''];
  return v;
}

function trimNonEmpty(v?: string[] | null) {
  const list = (v ?? []).map(s => s.trim()).filter(Boolean);
  return list.length ? list : undefined;
}

export const PARTS_OF_SPEECH: PartsOfSpeech[] = [
  'noun',
  'pronoun',
  'verb',
  'adjective',
  'adverb',
  'preposition',
  'conjunction',
  'interjunction',
  'article',
  'numeral',
  'particle',
];

export function useAddLexicalUnitForm() {
  const mode = useLexicalUnitEditorStore(s => s.mode);
  const editingUnit = useLexicalUnitEditorStore(s => s.editingUnit);
  const prefillValue = useLexicalUnitEditorStore(s => s.prefillValue);
  const openSearch = useLexicalUnitEditorStore(s => s.openSearch);

  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

  const form = useForm<FormValues>({
    defaultValues: {
      value: '',
      translation: '',
      transcription: '',
      meaning: '',
      partsOfSpeech: undefined,
      synonyms: '',
      antonyms: '',
      examples: [''],
      comment: '',
      audio: null,
      imageUrl: '',
    },
  });

  const { register, handleSubmit, setValue, reset, control } = form;

  const imageUrlValue = form.watch('imageUrl');

  const imagePreviewSrc = useMemo(() => {
    const raw = (imageUrlValue ?? '').trim();
    if (!raw) return null;

    if (raw.startsWith('http://') || raw.startsWith('https://')) return raw;

    return `${apiBaseUrl}${raw}`;
  }, [imageUrlValue]);

  const examples = form.watch('examples');
  const examplesCount = (examples?.length ?? 0);

  const addExample = () => {
    const current = examples ?? [''];
    if (current.length >= 5) return;
    setValue('examples', [...current, ''], { shouldDirty: true });
  };

  const removeExample = (index: number) => {
    const current = examples ?? [''];
    if (current.length <= 1) return;
    const next = current.slice();
    next.splice(index, 1);
    setValue('examples', next.length ? next : [''], { shouldDirty: true });
  };

  const {
    recording,
    audioBlob,
    startRecording,
    stopRecording,
    reset: resetAudio,
    audioRef,
    pause,
    isPlaying,
    play,
    elapsedSec,
    maxSec,
  } = useAudioRecorder();

  const [submitting, setSubmitting] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  const remoteAudioSrc = useMemo(() => {
    if (mode !== 'update') return null;
    if (!editingUnit?.audioUrl) return null;
    if (audioBlob) return null;
    const url = editingUnit.audioUrl;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${apiBaseUrl}${url}`;
  }, [mode, editingUnit?.audioUrl, audioBlob, apiBaseUrl]);

  const remoteImageSrc = useMemo(() => {
    if (mode !== 'update') return null;
    if (!editingUnit?.imageUrl) return null;
    const url = editingUnit.imageUrl;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${apiBaseUrl}${url}`;
  }, [mode, editingUnit?.imageUrl, apiBaseUrl]);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      return () => URL.revokeObjectURL(url);
    }
    setAudioURL(null);
  }, [audioBlob]);

  useEffect(() => {
    if (mode !== 'update') return;
    if (!editingUnit) return;

    reset({
      value: editingUnit.value ?? '',
      translation: editingUnit.translation ?? '',
      transcription: editingUnit.transcription ?? '',
      meaning: editingUnit.meaning ?? '',
      partsOfSpeech: editingUnit.partsOfSpeech ?? [],
      synonyms: editingUnit.synonyms ?? '',
      antonyms: editingUnit.antonyms ?? '',
      examples: ensureAtLeastOne(editingUnit.examples ?? null),
      comment: editingUnit.comment ?? '',
      imageUrl: editingUnit.imageUrl ?? '',
      audio: null,
    });

    resetAudio();
  }, [mode, editingUnit?.id]);

  useEffect(() => {
    if (mode !== 'add') return;
    if (!prefillValue) return;
    setValue('value', prefillValue, { shouldDirty: true });
  }, [mode, prefillValue, setValue]);

  const submit = handleSubmit(async (data) => {
    setSubmitting(true);
    try {
      const normalized = normalizeValue(data.value ?? '');
      const type = computeTypeByValue(normalized);
      const examples = trimNonEmpty(data.examples ?? []);
      console.log(data);
      const payload: AddLexicalUnitFormValues = {
        ...data,
        value: normalized,
        type,
        audio: audioBlob ?? undefined,
        examples,
      };

      if (mode === 'update') {
        if (!editingUnit?.id) throw new Error('No editing unit id');
        await updateLexicalUnit(editingUnit.id, payload);
        openSearch();
      } else {
        await addLexicalUnit(payload);
      }

      reset({
        value: '',
        translation: '',
        transcription: '',
        meaning: '',
        partsOfSpeech: undefined,
        synonyms: '',
        antonyms: '',
        examples: [''],
        comment: '',
        audio: null,
        imageUrl: '',
      });
      resetAudio();
      toast.success(mode === 'update' ? 'Updated!' : 'Saved!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;
        if (status === 409) {
          toast.warning('Already exists in your bank');
          return;
        }
      }
      console.error(err);
      toast.error(
        mode === 'update'
          ? 'Failed to update'
          : 'Failed to save'
      );
    } finally {
      setSubmitting(false);
    }
  });

  const handleResetAudio = () => {
    resetAudio();
    setValue('audio', null);
  };

  const partsOptions: { value: PartsOfSpeech; label: string }[] =
    PARTS_OF_SPEECH.map(p => ({ value: p, label: p }));

  return {
    // form bindings
    register,
    submit,
    setValue,

    // state
    mode,
    submitting,
    control,

    // examples
    examples: examples ?? [''],
    examplesCount,
    addExample,
    removeExample,

    // audio ui state
    recording,
    audioBlob,
    audioURL,
    remoteAudioSrc,
    audioRef,
    isPlaying,
    elapsedSec,
    maxSec,

    // audio actions
    startRecording,
    stopRecording,
    play,
    pause,
    handleResetAudio,

    // image
    imagePreviewSrc,
    remoteImageSrc,

    // constants
    partsOptions,
  };
}
