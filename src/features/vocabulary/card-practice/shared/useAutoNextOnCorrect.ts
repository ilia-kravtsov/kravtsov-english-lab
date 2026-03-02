import { useEffect } from 'react';

type Params = {
  enabled?: boolean;
  isFinished: boolean;
  locked: boolean;
  feedback: string | null;
  next: () => void;
  delayMs?: number;
};

export function useAutoNextOnCorrect({
                                       enabled = true,
                                       isFinished,
                                       locked,
                                       feedback,
                                       next,
                                       delayMs = 450,
                                     }: Params) {
  useEffect(() => {
    if (!enabled) return;
    if (isFinished) return;
    if (!locked) return;
    if (feedback !== 'correct') return;

    const t = window.setTimeout(() => {
      next();
    }, delayMs);

    return () => window.clearTimeout(t);
  }, [enabled, isFinished, locked, feedback, next, delayMs]);
}