import type { CSSProperties } from 'react';

import type { AudioFieldModel } from '@/features/vocabulary/lexical-unit-add/model/add-lexical-unit-form/add-lexical-unit-form.config.ts';

import style from './AddLexicalUnitForm.module.scss';

type Props = {
  audio: AudioFieldModel;
  idleTitle: string;
  recordingTitle: string;
  recordButtonStyle: CSSProperties;
  actionButtonStyle: CSSProperties;
};

export function AudioField({
  audio,
  idleTitle,
  recordingTitle,
  recordButtonStyle,
  actionButtonStyle,
}: Props) {

  const {
    recording,
    audioBlob,
    audioUrl,
    remoteAudioSrc,
    audioRef,
    isPlaying,
    elapsedSec,
    maxSec,
    startRecording,
    stopRecording,
    play,
    pause,
    reset,
  } = audio;

  const audioSrc = audioBlob ? (audioUrl ?? undefined) : remoteAudioSrc;
  const hasAnyAudio = Boolean(audioSrc);
  const hasRecordedAudio = Boolean(audioBlob);

  return (
    <div className={style.audioContainer}>
      <button
        type={'button'}
        className={style.button}
        onClick={recording ? stopRecording : startRecording}
        style={recordButtonStyle}
      >
        {recording ? recordingTitle : idleTitle}
      </button>

      {recording && (
        <span className={style.recordHint}>
          Recording… {elapsedSec}/{maxSec}s
        </span>
      )}

      {hasAnyAudio && (
        <>
          <audio
            ref={audioRef}
            src={audioSrc!}
            onEnded={pause}
            className={style.audio}
            preload={'metadata'}
          />

          <button
            type={'button'}
            className={style.button}
            onClick={isPlaying ? pause : play}
            style={actionButtonStyle}
          >
            {isPlaying ? 'Stop' : 'Play'}
          </button>

          {hasRecordedAudio && (
            <button
              type={'button'}
              className={style.button}
              onClick={reset}
              disabled={!audioBlob}
              style={actionButtonStyle}
            >
              Reset
            </button>
          )}
        </>
      )}
    </div>
  );
}
