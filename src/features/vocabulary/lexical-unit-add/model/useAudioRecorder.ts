import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import type {
  BlobOrNull,
  HTMLAudioElementOrNull,
  MediaRecorderOrNull,
  NumberOrNull,
} from '@/features/vocabulary/lexical-unit-add/model/lexical-unit-add.types.ts';

const MAX_RECORD_MS = 10_000;
const MAX_RECORD_SEC = MAX_RECORD_MS / 1000;

export function useAudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<BlobOrNull>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorderOrNull>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElementOrNull>(null);
  const chunksRef = useRef<Blob[]>([]);
  const stopTimerRef = useRef<NumberOrNull>(null);
  const tickTimerRef = useRef<NumberOrNull>(null);
  const shouldSaveRecordingRef = useRef(true);

  const clearStopTimer = () => {
    if (stopTimerRef.current != null) {
      window.clearTimeout(stopTimerRef.current);
      stopTimerRef.current = null;
    }
  };

  const clearTickTimer = () => {
    if (tickTimerRef.current != null) {
      window.clearInterval(tickTimerRef.current);
      tickTimerRef.current = null;
    }
  };

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  };

  const resetPlayback = () => {
    const audio = audioRef.current;
    if (!audio) {
      setIsPlaying(false);
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  };

  const cleanupRecordingResources = () => {
    clearStopTimer();
    clearTickTimer();
    stopStream();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    setRecording(false);
    setElapsedSec(0);
  };

  const stopRecordingInternal = (shouldSave: boolean) => {
    shouldSaveRecordingRef.current = shouldSave;

    clearStopTimer();
    clearTickTimer();

    const recorder = mediaRecorderRef.current;

    if (!recorder) {
      stopStream();
      setRecording(false);
      setElapsedSec(0);
      return;
    }

    if (recorder.state !== 'inactive') {
      recorder.stop();
      return;
    }

    cleanupRecordingResources();
  };

  const startRecording = async () => {
    if (recording) return;

    resetPlayback();
    stopRecordingInternal(false);
    setAudioBlob(null);
    setElapsedSec(0);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);

      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      shouldSaveRecordingRef.current = true;

      recorder.ondataavailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        const shouldSave = shouldSaveRecordingRef.current;
        const hasChunks = chunksRef.current.length > 0;

        if (shouldSave && hasChunks) {
          setAudioBlob(new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' }));
        }

        cleanupRecordingResources();
      };

      recorder.start();
      setRecording(true);

      tickTimerRef.current = window.setInterval(() => {
        setElapsedSec((value) => Math.min(MAX_RECORD_SEC, value + 1));
      }, 1000);

      stopTimerRef.current = window.setTimeout(() => {
        stopRecordingInternal(true);
      }, MAX_RECORD_MS);
    } catch {
      cleanupRecordingResources();
      toast.error('Unable to access microphone');
    }
  };


  const stopRecording = () => {
    stopRecordingInternal(true);
  };

  const play = () => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }

    void audio.play();
    setIsPlaying(true);
  };

  const pause = () => {
    const audio = audioRef.current;
    if (!audio) {
      setIsPlaying(false);
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const reset = () => {
    resetPlayback();
    stopRecordingInternal(false);
    setAudioBlob(null);
    setElapsedSec(0);
  };

  const setExternalBlob = (blob: BlobOrNull) => {
    resetPlayback();
    stopRecordingInternal(false);
    setAudioBlob(blob);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
    };
  }, [audioBlob]);

  useEffect(() => {
    return () => {
      resetPlayback();
      stopRecordingInternal(false);
    };
  }, []);

  return {
    recording,
    audioBlob,
    audioRef,
    isPlaying,
    startRecording,
    stopRecording,
    play,
    pause,
    reset,
    setExternalBlob,
    elapsedSec,
    maxSec: MAX_RECORD_SEC,
  };
}
