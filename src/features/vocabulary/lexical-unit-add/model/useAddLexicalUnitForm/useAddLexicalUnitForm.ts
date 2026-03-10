import axios from 'axios';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { addLexicalUnit, updateLexicalUnit } from '@/entities/lexical-unit/api/lexical-unit.api.ts';
import type { AddLexicalUnitFormValues } from '@/entities/lexical-unit/model/lexical-unit.types.ts';
import {
  type ArrayFieldName,
  type AudioFieldModel,
  buildPayload,
  createEditFormValues,
  getEmptyFormValues,
  MAX_ITEMS,
  PARTS_OPTIONS,
  useObjectUrl,
} from '@/features/vocabulary/lexical-unit-add/model/useAddLexicalUnitForm/useAddLexicalUnitForm.config.ts';
import { toAbsoluteMediaUrl } from '@/shared/lib/url/toAbsoluteMediaUrl.ts';

import { useLexicalUnitEditorStore } from '../lexicalUnitEditor.store.ts';
import { useAudioRecorder } from '../useAudioRecorder.ts';

export function useAddLexicalUnitForm() {
  const mode = useLexicalUnitEditorStore((s) => s.mode);
  const editingUnit = useLexicalUnitEditorStore((s) => s.editingUnit);
  const prefillValue = useLexicalUnitEditorStore((s) => s.prefillValue);
  const openSearch = useLexicalUnitEditorStore((s) => s.openSearch);

  const form = useForm<AddLexicalUnitFormValues>({
    defaultValues: getEmptyFormValues(),
  });

  const { register, handleSubmit, setValue, reset, control, getValues } = form;

  const imageUrlValue = form.watch('imageUrl');
  const examples = form.watch('examples');
  const synonyms = form.watch('synonyms');
  const antonyms = form.watch('antonyms');

  const imagePreviewSrc = toAbsoluteMediaUrl((imageUrlValue ?? '').trim());

  const examplesCount = examples?.length ?? 0;
  const synonymsCount = synonyms?.length ?? 0;
  const antonymsCount = antonyms?.length ?? 0;

  const updateArrayField = (field: ArrayFieldName, updater: (current: string[]) => string[]) => {
    const current = getValues(field) ?? [''];
    const next = updater(current);

    setValue(field, next.length ? next : [''], {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const appendArrayFieldItem = (field: ArrayFieldName) => {
    updateArrayField(field, (current) => {
      if (current.length >= MAX_ITEMS) return current;
      return [...current, ''];
    });
  };

  const removeArrayFieldItem = (field: ArrayFieldName, index: number) => {
    updateArrayField(field, (current) => {
      if (current.length <= 1) return current;
      return current.filter((_, i) => i !== index);
    });
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

  const meaningRecorder = useAudioRecorder();
  const exampleRecorder = useAudioRecorder();

  const [submitting, setSubmitting] = useState(false);

  const audioURL = useObjectUrl(audioBlob);
  const meaningAudioURL = useObjectUrl(meaningRecorder.audioBlob);
  const exampleAudioURL = useObjectUrl(exampleRecorder.audioBlob);

  const remoteAudioSrc =
    mode === 'update' && !audioBlob ? toAbsoluteMediaUrl(editingUnit?.audioUrl) : null;

  const remoteMeaningAudioSrc =
    mode === 'update' && !meaningRecorder.audioBlob
      ? toAbsoluteMediaUrl(editingUnit?.soundMeaningUrl)
      : null;

  const remoteExampleAudioSrc =
    mode === 'update' && !exampleRecorder.audioBlob
      ? toAbsoluteMediaUrl(editingUnit?.soundExampleUrl)
      : null;

  const remoteImageSrc = mode === 'update' ? toAbsoluteMediaUrl(editingUnit?.imageUrl) : null;

  useEffect(() => {
    if (mode !== 'update' || !editingUnit) return;

    reset(createEditFormValues(editingUnit));
    resetAudio();
    meaningRecorder.reset();
    exampleRecorder.reset();
  }, [mode, editingUnit, reset, resetAudio, meaningRecorder, exampleRecorder]);

  useEffect(() => {
    if (mode !== 'add' || !prefillValue) return;
    setValue('value', prefillValue, { shouldDirty: true });
  }, [mode, prefillValue, setValue]);

  const submit = handleSubmit(async (data) => {
    setSubmitting(true);

    try {
      const payload = buildPayload(
        data,
        audioBlob,
        meaningRecorder.audioBlob,
        exampleRecorder.audioBlob,
      );

      if (mode === 'update') {

        if (!editingUnit?.id) {
          throw new Error('No editing unit id');
        }

        await updateLexicalUnit(editingUnit.id, payload);
        openSearch();
      } else {
        await addLexicalUnit(payload);
      }

      reset(getEmptyFormValues());
      resetAudio();
      meaningRecorder.reset();
      exampleRecorder.reset();

      toast.success(mode === 'update' ? 'Updated!' : 'Saved!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        toast.warning('Already exists in your bank');
        return;
      }

      console.error(err);
      toast.error(mode === 'update' ? 'Failed to update' : 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  });

  const handleResetAudio = () => {
    resetAudio();
    setValue('audio', null);
  };

  const handleResetMeaningAudio = () => {
    meaningRecorder.reset();
    setValue('soundMeaning', null);
  };

  const handleResetExampleAudio = () => {
    exampleRecorder.reset();
    setValue('soundExample', null);
  };

  const mainAudio: AudioFieldModel = {
    recording,
    audioBlob,
    audioUrl: audioURL,
    remoteAudioSrc,
    audioRef,
    isPlaying,
    elapsedSec,
    maxSec,
    startRecording,
    stopRecording,
    play,
    pause,
    reset: handleResetAudio,
  };
  const meaningAudio: AudioFieldModel = {
    recording: meaningRecorder.recording,
    audioBlob: meaningRecorder.audioBlob,
    audioUrl: meaningAudioURL,
    remoteAudioSrc: remoteMeaningAudioSrc,
    audioRef: meaningRecorder.audioRef,
    isPlaying: meaningRecorder.isPlaying,
    elapsedSec: meaningRecorder.elapsedSec,
    maxSec: meaningRecorder.maxSec,
    startRecording: meaningRecorder.startRecording,
    stopRecording: meaningRecorder.stopRecording,
    play: meaningRecorder.play,
    pause: meaningRecorder.pause,
    reset: handleResetMeaningAudio,
  };
  const exampleAudio: AudioFieldModel = {
    recording: exampleRecorder.recording,
    audioBlob: exampleRecorder.audioBlob,
    audioUrl: exampleAudioURL,
    remoteAudioSrc: remoteExampleAudioSrc,
    audioRef: exampleRecorder.audioRef,
    isPlaying: exampleRecorder.isPlaying,
    elapsedSec: exampleRecorder.elapsedSec,
    maxSec: exampleRecorder.maxSec,
    startRecording: exampleRecorder.startRecording,
    stopRecording: exampleRecorder.stopRecording,
    play: exampleRecorder.play,
    pause: exampleRecorder.pause,
    reset: handleResetExampleAudio,
  };

  return {
    register,
    submit,
    setValue,

    mode,
    submitting,
    control,

    examples: examples ?? [''],
    examplesCount,
    addExample: () => appendArrayFieldItem('examples'),
    removeExample: (index: number) => removeArrayFieldItem('examples', index),

    synonyms: synonyms ?? [''],
    synonymsCount,
    addSynonym: () => appendArrayFieldItem('synonyms'),
    removeSynonym: (index: number) => removeArrayFieldItem('synonyms', index),

    antonyms: antonyms ?? [''],
    antonymsCount,
    addAntonym: () => appendArrayFieldItem('antonyms'),
    removeAntonym: (index: number) => removeArrayFieldItem('antonyms', index),

    mainAudio,
    meaningAudio,
    exampleAudio,

    imagePreviewSrc,
    remoteImageSrc,

    partsOptions: PARTS_OPTIONS,
  };
}
