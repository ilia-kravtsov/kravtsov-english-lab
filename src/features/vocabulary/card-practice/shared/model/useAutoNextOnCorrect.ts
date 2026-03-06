import { useEffect } from 'react';

type Params = {
  enabled?: boolean;
  isFinished: boolean;
  locked: boolean;
  feedback: string | null;
  next: () => void;
  delayMs?: number;

  beforeNext?: () => void;
  commitDelayMs?: number;
};

export function useAutoNextOnCorrect({
                                       enabled = true,
                                       isFinished,
                                       locked,
                                       feedback,
                                       next,
                                       delayMs = 500,
                                       beforeNext,
                                       commitDelayMs = 0,
                                     }: Params) {
  useEffect(() => {
    if (!enabled) return;
    if (isFinished) return;
    if (!locked) return;
    if (feedback !== 'correct') return;

    const t = window.setTimeout(() => {
      if (beforeNext) beforeNext();

      if (commitDelayMs > 0) {
        window.setTimeout(() => next(), commitDelayMs);
      } else {
        next();
      }
    }, delayMs);

    return () => window.clearTimeout(t);
  }, [enabled, isFinished, locked, feedback, next, delayMs, beforeNext, commitDelayMs]);
}