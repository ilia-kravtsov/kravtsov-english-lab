import { type RefObject, useEffect, useRef } from 'react';

import type { TextInputFeedback } from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types';
import { useAutoNextOnCorrect } from '@/features/vocabulary/card-practice/shared/model/useAutoNextOnCorrect.ts';

type Params<TCard> = {
  cards: TCard[];
  index: number;
  locked: boolean;
  isFinished: boolean;
  feedback: TextInputFeedback;
  next: () => void;
  onAutoNext?: () => void;
  autoNextCommitDelayMs?: number;
  withInputFocus?: boolean;
};

type Result<TCard> = {
  inputRef: RefObject<HTMLInputElement | null>;
  current: TCard | null;
};

export function usePracticeView<TCard>({
                                         cards,
                                         index,
                                         locked,
                                         isFinished,
                                         feedback,
                                         next,
                                         onAutoNext,
                                         autoNextCommitDelayMs,
                                         withInputFocus = false,
                                       }: Params<TCard>): Result<TCard> {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!withInputFocus) return;
    if (!locked) {
      inputRef.current?.focus();
    }
  }, [withInputFocus, index, locked]);

  useAutoNextOnCorrect({
    isFinished,
    locked,
    feedback,
    next,
    delayMs: 450,
    beforeNext: onAutoNext,
    commitDelayMs: autoNextCommitDelayMs ?? 130,
  });

  const current = cards[index] ?? null;

  return {
    inputRef,
    current,
  };
}