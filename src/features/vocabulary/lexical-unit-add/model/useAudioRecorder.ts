import { useState, useRef } from 'react';

const MAX_RECORD_MS = 10_000;

export function useAudioRecorder() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSec, setElapsedSec] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const stopTimerRef = useRef<number | null>(null);
  const tickTimerRef = useRef<number | null>(null);

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

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => chunksRef.current.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      setAudioBlob(blob);
      stream.getTracks().forEach(t => t.stop());

      clearStopTimer();
      clearTickTimer();
      setElapsedSec(0);
    };

    mediaRecorder.start();
    setRecording(true);

    setElapsedSec(0);
    clearTickTimer();

    tickTimerRef.current = window.setInterval(() => {
      setElapsedSec(s => Math.min(10, s + 1));
    }, 1000);

    clearStopTimer();
    stopTimerRef.current = window.setTimeout(() => {
      stopRecording();
    }, MAX_RECORD_MS);
  };

  const stopRecording = () => {
    clearStopTimer();
    clearTickTimer();
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const play = () => {
    audioRef.current?.play();
    setIsPlaying(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const reset = () => {
    clearStopTimer();
    clearTickTimer();
    pause();
    setAudioBlob(null);
    setElapsedSec(0);
  };

  const setExternalBlob = (blob: Blob | null) => {
    pause();
    setAudioBlob(blob);
  };

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
    maxSec: 10,
  };
}
