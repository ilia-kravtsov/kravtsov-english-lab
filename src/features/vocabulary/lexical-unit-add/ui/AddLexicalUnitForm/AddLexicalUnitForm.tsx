import { useForm } from 'react-hook-form';
import { useAudioRecorder } from '../../model/useAudioRecorder.ts';
import { addLexicalUnit, updateLexicalUnit } from '@/entities/lexical-unit/api/lexical-unit.api.ts';
import { useEffect, useMemo, useState } from 'react';
import type {
  AddLexicalUnitFormValues,
  PartsOfSpeech,
} from '@/entities/lexical-unit/model/lexical-unit.types.ts';
import style from './AddLexicalUnitForm.module.scss';
import { Input } from '@/shared/ui/Input/Input.tsx';
import { Button, Textarea } from '@/shared/ui';
import { useLexicalUnitEditorStore } from '@/features/vocabulary/lexical-unit-add/model/lexicalUnitEditor.store.ts';
import axios from 'axios';

const partsOfSpeech: PartsOfSpeech[] = [
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

function normalizeValue(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function computeTypeByValue(value: string): AddLexicalUnitFormValues['type'] {
  const v = normalizeValue(value);
  return v.includes(' ') ? 'expression' : 'word';
}

export function AddLexicalUnitForm() {
  const mode = useLexicalUnitEditorStore(s => s.mode);
  const editingUnit = useLexicalUnitEditorStore(s => s.editingUnit);
  const prefillValue = useLexicalUnitEditorStore(s => s.prefillValue);
  const openSearch = useLexicalUnitEditorStore(s => s.openSearch);

  const { register, handleSubmit, setValue, reset } =
    useForm<AddLexicalUnitFormValues>({
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
  }, [mode, editingUnit, audioBlob, apiBaseUrl]);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAudioURL(null);
    }
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

  const onSubmit = async (data: AddLexicalUnitFormValues) => {
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
      alert(mode === 'update' ? 'Updated!' : 'Saved!');
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const status = err.response?.status;

        if (status === 409) {
          alert('Already exists in your bank');
          return;
        }
      }

      console.error(err);
      alert(mode === 'update' ? 'Failed to update' : 'Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
  };

  const handleResetAudio = () => {
    resetAudio();
    setValue('audio', null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.container}>
      <Input
        {...register('value', { required: true })}
        placeholder={'word or expression'}
      />
      <Input {...register('translation')} placeholder={'translation'} />
      <div className={style.audioContainer}>
        {!audioBlob && remoteAudioSrc && (
          <div className={style.remoteAudio}>
            <audio controls preload="metadata" src={remoteAudioSrc} />
          </div>
        )}
        <button
          type={'button'}
          className={style.button}
          onClick={recording ? handleStopRecording : startRecording}
          style={{ width: '112px' }}
        >
          {recording ? 'Stop Recording' : 'Record a sound'}
        </button>
        {recording && (
          <span className={style.recordHint}>
            Recording… {elapsedSec}/{maxSec}s
          </span>
        )}
        {audioBlob && (
          <>
            <audio
              ref={audioRef}
              src={audioURL ?? undefined}
              onEnded={() => pause()}
              className={style.audio}
            />

            <button
              type={'button'}
              className={style.button}
              onClick={isPlaying ? pause : play}
              disabled={!audioBlob}
              style={{ width: '56px' }}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              type={'button'}
              className={style.button}
              onClick={handleResetAudio}
              disabled={!audioBlob}
              style={{ width: '56px' }}
            >
              Reset
            </button>
          </>
        )}
      </div>
      <div className={style.twoFieldsBox}>
        <Input
          {...register('transcription')}
          placeholder={'transcription'}
        />
        <Input
          {...register('partsOfSpeech')}
          list={'parts-of-speech'}
          placeholder={'part of speech'}
        />
        <datalist id={'parts-of-speech'}>
          {partsOfSpeech.map((part) => (
            <option key={part} value={part} />
          ))}
        </datalist>
      </div>
      <Input {...register('synonyms')} placeholder={'synonyms'} />
      <Input {...register('antonyms')} placeholder={'antonyms'} />
      <Textarea {...register('meaning')} placeholder={'meaning in English'} />
      <Textarea {...register('examples')} placeholder={'examples'} />
      <Textarea {...register('comment')} placeholder={'comment'} />
      <Button
        type={'submit'}
        disabled={submitting}
        title={
          submitting
            ? mode === 'update'
              ? 'Updating...'
              : 'Saving...'
            : mode === 'update'
              ? 'Update'
              : 'Save'
        }
        style={{ width: '160px', fontSize: '16px' }}
      />
    </form>
  );
}
