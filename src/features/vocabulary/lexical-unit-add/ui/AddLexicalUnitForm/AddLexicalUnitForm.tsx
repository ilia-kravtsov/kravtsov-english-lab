import { useForm } from 'react-hook-form';
import { useAudioRecorder } from '../../model/useAudioRecorder.ts';
import { addLexicalUnit } from '@/entities/lexical-unit/api/lexical-unit.api.ts';
import { useEffect, useState } from 'react';
import type {
  AddLexicalUnitFormValues,
  PartsOfSpeech,
} from '@/entities/lexical-unit/model/lexical-unit.types.ts';
import style from './AddLexicalUnitForm.module.scss';
import { Input } from '@/shared/ui/Input/Input.tsx';
import { Button, Textarea } from '@/shared/ui';

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

export function AddLexicalUnitForm() {
  const { register, handleSubmit, setValue, reset } =
    useForm<AddLexicalUnitFormValues>();
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
  } = useAudioRecorder();
  const [submitting, setSubmitting] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);

  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setAudioURL(null);
    }
  }, [audioBlob]);

  const onSubmit = async (data: AddLexicalUnitFormValues) => {
    setSubmitting(true);
    try {
      const v = (data.value ?? '').trim().replace(/\s+/g, ' ');
      const type = v.includes(' ') ? 'expression' : 'word';
      await addLexicalUnit({ ...data, type, audio: audioBlob ?? undefined });
      reset();
      resetAudio();
      alert('Saved!');
    } catch (err) {
      console.error(err);
      alert('Failed to save');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    setValue('audio', audioBlob ?? null);
  };

  const handleResetAudio = () => {
    resetAudio();
    setValue('audio', null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={style.container}>
      <div className={style.twoFieldsBox}>
        <Input
          {...register('value', { required: true })}
          placeholder={'word or expression'}
        />
        <Input {...register('translation')} placeholder={'translation'} />
      </div>
      <div className={style.twoFieldsBox}>
        <div className={style.audioContainer}>
          <button
            type={'button'}
            className={style.button}
            onClick={recording ? handleStopRecording : startRecording}
            style={{ width: '112px' }}
          >
            {recording ? 'Stop Recording' : 'Record a sound'}
          </button>
          {audioBlob && (
            <>
              <audio
                ref={audioRef}
                src={audioURL ?? undefined}
                onEnded={() => pause()}
              />

              <button
                type={'button'}
                className={style.button}
                onClick={isPlaying ? pause : play}
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
        <Input
          {...register('transcription')}
          placeholder={'transcription'}
          style={{ maxWidth: '50%' }}
        />
      </div>
      <div className={style.twoFieldsBox}>
        <Input {...register('meaning')} placeholder={'meaning in English'} />
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
      <div className={style.twoFieldsBox}>
        <Input {...register('synonyms')} placeholder={'synonyms'} />
        <Input {...register('antonyms')} placeholder={'antonyms'} />
      </div>
      <Textarea {...register('examples')} placeholder={'examples'} />
      <Textarea {...register('comment')} placeholder={'comment'} />
      <Button
        type={'submit'}
        disabled={submitting}
        title={submitting ? 'Saving...' : 'Save'}
        style={{ width: '160px', fontSize: '16px' }}
      />
    </form>
  );
}
