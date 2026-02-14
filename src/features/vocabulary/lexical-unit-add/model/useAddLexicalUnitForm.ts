import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';

import type { AddLexicalUnitFormValues, PartsOfSpeech } from '@/entities/lexical-unit/model/lexical-unit.types';
import { addLexicalUnit, updateLexicalUnit } from '@/entities/lexical-unit/api/lexical-unit.api';
import { useLexicalUnitEditorStore } from './lexicalUnitEditor.store';
import { useAudioRecorder } from './useAudioRecorder';

function normalizeValue(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function computeTypeByValue(value: string): AddLexicalUnitFormValues['type'] {
  const v = normalizeValue(value);
  return v.includes(' ') ? 'expression' : 'word';
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

  const form = useForm<AddLexicalUnitFormValues>({
    defaultValues: {
      value: '',
      translation: '',
      transcription: '',
      meaning: '',
      partsOfSpeech: undefined,
      synonyms: '',
      antonyms: '',
      examples: '',
      comment: '',
      audio: null,
    },
  });

  const { register, handleSubmit, setValue, reset } = form;

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

  const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

  const remoteAudioSrc = useMemo(() => {
    if (mode !== 'update') return null;
    if (!editingUnit?.audioUrl) return null;
    if (audioBlob) return null;
    const url = editingUnit.audioUrl;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${apiBaseUrl}${url}`;
  }, [mode, editingUnit?.audioUrl, audioBlob, apiBaseUrl]);

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
      partsOfSpeech: editingUnit.partsOfSpeech ?? undefined,
      synonyms: editingUnit.synonyms ?? '',
      antonyms: editingUnit.antonyms ?? '',
      examples: editingUnit.examples ?? '',
      comment: editingUnit.comment ?? '',
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

      const payload: AddLexicalUnitFormValues = {
        ...data,
        value: normalized,
        type,
        audio: audioBlob ?? undefined,
      };

      if (mode === 'update') {
        if (!editingUnit?.id) throw new Error('No editing unit id');
        await updateLexicalUnit(editingUnit.id, payload);
        openSearch();
      } else {
        await addLexicalUnit(payload);
      }

      reset();
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

  return {
    // form bindings
    register,
    submit,
    setValue,

    // state
    mode,
    submitting,

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

    // constants
    partsOfSpeech: PARTS_OF_SPEECH,
  };
}
