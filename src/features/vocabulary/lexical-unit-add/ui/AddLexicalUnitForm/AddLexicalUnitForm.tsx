import { Controller } from 'react-hook-form';

import { useAddLexicalUnitForm } from '@/features/vocabulary/lexical-unit-add/model/useAddLexicalUnitForm';
import { Button, Textarea } from '@/shared/ui';
import { Input } from '@/shared/ui/Input/Input';
import { MultiSelect } from '@/shared/ui/MultiSelect/MultiSelect';

import style from './AddLexicalUnitForm.module.scss';

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

    meaningRecording,
    meaningAudioBlob,
    meaningAudioURL,
    remoteMeaningAudioSrc,
    meaningAudioRef,
    meaningIsPlaying,
    meaningElapsedSec,
    meaningMaxSec,
    startMeaningRecording,
    stopMeaningRecording,
    playMeaning,
    pauseMeaning,
    handleResetMeaningAudio,

    exampleRecording,
    exampleAudioBlob,
    exampleAudioURL,
    remoteExampleAudioSrc,
    exampleAudioRef,
    exampleIsPlaying,
    exampleElapsedSec,
    exampleMaxSec,
    startExampleRecording,
    stopExampleRecording,
    playExample,
    pauseExample,
    handleResetExampleAudio,

    imagePreviewSrc,

    examples,
    examplesCount,
    addExample,
    removeExample,

    synonyms,
    synonymsCount,
    addSynonym,
    removeSynonym,

    antonyms,
    antonymsCount,
    addAntonym,
    removeAntonym,
  } = useAddLexicalUnitForm();

  const stylesLargeButton = { width: '160px', fontSize: '16px' };
  const stylesBigButton = { minWidth: '144px' };
  const stylesMediumButton = { minWidth: '56px' };
  const stylesSmallButton = { minWidth: '44px' };

  return (
    <form onSubmit={submit} className={style.container}>
      <Input {...register('value', { required: true })} placeholder={'word or expression *'} />
      <Input {...register('translation')} placeholder={'translation *'} />

      <div className={style.audioContainer}>
        {!audioBlob && remoteAudioSrc && (
          <div className={style.remoteAudio}>
            <audio controls preload={'metadata'} src={remoteAudioSrc} />
          </div>
        )}

        <button
          type={'button'}
          className={style.button}
          onClick={recording ? stopRecording : startRecording}
          style={stylesBigButton}
        >
          {recording ? 'Stop Recording' : 'Record a Sound'}
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
              style={stylesMediumButton}
            >
              {isPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              type={'button'}
              className={style.button}
              onClick={handleResetAudio}
              disabled={!audioBlob}
              style={stylesMediumButton}
            >
              Reset
            </button>
          </>
        )}
      </div>

      <div className={style.audioContainer}>
        {!meaningAudioBlob && remoteMeaningAudioSrc && (
          <div className={style.remoteAudio}>
            <audio controls preload={'metadata'} src={remoteMeaningAudioSrc} />
          </div>
        )}

        <button
          type={'button'}
          className={style.button}
          onClick={meaningRecording ? stopMeaningRecording : startMeaningRecording}
          style={stylesBigButton}
        >
          {meaningRecording ? 'Stop Meaning' : 'Record Meaning'}
        </button>

        {meaningRecording && (
          <span className={style.recordHint}>
            Recording… {meaningElapsedSec}/{meaningMaxSec}s
          </span>
        )}

        {meaningAudioBlob && (
          <>
            <audio
              ref={meaningAudioRef}
              src={meaningAudioURL ?? undefined}
              onEnded={() => pauseMeaning()}
              className={style.audio}
            />

            <button
              type={'button'}
              className={style.button}
              onClick={meaningIsPlaying ? pauseMeaning : playMeaning}
              disabled={!meaningAudioBlob}
              style={stylesMediumButton}
            >
              {meaningIsPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              type={'button'}
              className={style.button}
              onClick={handleResetMeaningAudio}
              disabled={!meaningAudioBlob}
              style={stylesMediumButton}
            >
              Reset
            </button>
          </>
        )}
      </div>

      <div className={style.audioContainer}>
        {!exampleAudioBlob && remoteExampleAudioSrc && (
          <div className={style.remoteAudio}>
            <audio controls preload={'metadata'} src={remoteExampleAudioSrc} />
          </div>
        )}

        <button
          type={'button'}
          className={style.button}
          onClick={exampleRecording ? stopExampleRecording : startExampleRecording}
          style={stylesBigButton}
        >
          {exampleRecording ? 'Stop Example' : 'Record Example'}
        </button>

        {exampleRecording && (
          <span className={style.recordHint}>
            Recording… {exampleElapsedSec}/{exampleMaxSec}s
          </span>
        )}

        {exampleAudioBlob && (
          <>
            <audio
              ref={exampleAudioRef}
              src={exampleAudioURL ?? undefined}
              onEnded={() => pauseExample()}
              className={style.audio}
            />

            <button
              type={'button'}
              className={style.button}
              onClick={exampleIsPlaying ? pauseExample : playExample}
              disabled={!exampleAudioBlob}
              style={stylesMediumButton}
            >
              {exampleIsPlaying ? 'Pause' : 'Play'}
            </button>

            <button
              type={'button'}
              className={style.button}
              onClick={handleResetExampleAudio}
              disabled={!exampleAudioBlob}
              style={stylesMediumButton}
            >
              Reset
            </button>
          </>
        )}
      </div>

      <Input {...register('transcription')} placeholder={'transcription'} />

      <Textarea {...register('meaning')} placeholder={'meaning in English'} />

      <div className={style.imageContainer}>
        {imagePreviewSrc && (
          <div className={style.imagePreview}>
            <img src={imagePreviewSrc} alt={'lexical unit image'} />
          </div>
        )}

        <Input {...register('imageUrl')} placeholder={'image link https://...'} />
      </div>

      <Controller
        control={control}
        name={'partsOfSpeech'}
        render={({ field }) => (
          <MultiSelect
            value={field.value ?? []}
            onChange={field.onChange}
            options={partsOptions}
            placeholder={'parts of speech'}
          />
        )}
      />

      <div className={style.examplesList}>
        {synonyms.map((_, i) => (
          <div key={`syn-${i}`} className={style.examplesRow}>
            <Input
              {...register(`synonyms.${i}` as const)}
              placeholder={i === 0 ? 'synonym' : `synonym ${i + 1}`}
            />
            <div className={style.examplesActions}>
              {synonymsCount < 5 && i === synonymsCount - 1 && (
                <Button
                  type={'button'}
                  title={'+'}
                  onClick={addSynonym}
                  style={stylesSmallButton}
                />
              )}
              {synonymsCount > 1 && (
                <Button
                  type={'button'}
                  title={'🗑'}
                  onClick={() => removeSynonym(i)}
                  style={stylesSmallButton}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={style.examplesList}>
        {antonyms.map((_, i) => (
          <div key={`ant-${i}`} className={style.examplesRow}>
            <Input
              {...register(`antonyms.${i}` as const)}
              placeholder={i === 0 ? 'antonym' : `antonym ${i + 1}`}
            />
            <div className={style.examplesActions}>
              {antonymsCount < 5 && i === antonymsCount - 1 && (
                <Button
                  type={'button'}
                  title={'+'}
                  onClick={addAntonym}
                  style={stylesSmallButton}
                />
              )}
              {antonymsCount > 1 && (
                <Button
                  type={'button'}
                  title={'🗑'}
                  onClick={() => removeAntonym(i)}
                  style={stylesSmallButton}
                />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className={style.examplesList}>
        {examples.map((_, i) => (
          <div key={i} className={style.examplesRow}>
            <Textarea
              {...register(`examples.${i}` as const)}
              placeholder={i === 0 ? 'example' : `example ${i + 1}`}
              rows={2}
            />
            <div className={style.examplesActions}>
              {examplesCount < 5 && i === examplesCount - 1 && (
                <Button
                  type={'button'}
                  title={'+'}
                  onClick={addExample}
                  style={stylesSmallButton}
                />
              )}
              {examplesCount > 1 && (
                <Button
                  type={'button'}
                  title={'🗑'}
                  onClick={() => removeExample(i)}
                  style={stylesSmallButton}
                />
              )}
            </div>
          </div>
        ))}
      </div>

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
        style={stylesLargeButton}
      />
    </form>
  );
}
