import style from './AddLexicalUnitForm.module.scss';
import { Input } from '@/shared/ui/Input/Input.tsx';
import { Button, Textarea } from '@/shared/ui';
import { useAddLexicalUnitForm } from '@/features/vocabulary/lexical-unit-add/model/useAddLexicalUnitForm.ts';
import { Controller } from 'react-hook-form';
import { MultiSelect } from '@/shared/ui/MultiSelect/MultiSelect.tsx';

export function AddLexicalUnitForm() {
  const {
    register,
    submit,
    mode,
    submitting,

    partsOptions,

    recording,
    audioBlob,
    audioURL,
    remoteAudioSrc,
    audioRef,
    isPlaying,
    elapsedSec,
    maxSec,

    startRecording,
    stopRecording,
    play,
    pause,
    handleResetAudio,
    control,

    imagePreviewSrc,
  } = useAddLexicalUnitForm();

  return (
    <form onSubmit={submit} className={style.container}>
      <Input{...register('value', { required: true })} placeholder={'word or expression'} />
      <Input {...register('translation')} placeholder={'translation'} />

      <div className={style.audioContainer}>

        {!audioBlob && remoteAudioSrc && (
          <div className={style.remoteAudio}>
            <audio controls preload={"metadata"} src={remoteAudioSrc} />
          </div>
        )}

        <button
          type={'button'}
          className={style.button}
          onClick={recording ? stopRecording : startRecording}
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

      <Input{...register('transcription')} placeholder={'transcription'} />

      <div className={style.imageContainer}>
        {imagePreviewSrc && (
          <div className={style.imagePreview}>
            <img src={imagePreviewSrc} alt={'lexical unit image'} />
          </div>
        )}

        <Input {...register('imageUrl')} placeholder={'image link (https://...)'} />
      </div>

      <Controller
        control={control}
        name={"partsOfSpeech"}
        render={({ field }) => (
          <MultiSelect
            value={field.value ?? []}
            onChange={field.onChange}
            options={partsOptions}
            placeholder={"parts of speech"}
          />
        )}
      />

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
