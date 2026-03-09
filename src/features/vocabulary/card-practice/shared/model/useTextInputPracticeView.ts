import { useEffect, useRef } from 'react';

import type {
  TextInputFeedback,
  TextInputSessionCard,
} from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types.ts';

import { useAutoNextOnCorrect } from './useAutoNextOnCorrect.ts';

type Params<TCard extends TextInputSessionCard> = {
  cards: TCard[];
  index: number;
  locked: boolean;
  isFinished: boolean;
  feedback: TextInputFeedback;
  next: () => void;
  onAutoNext?: () => void;
  autoNextCommitDelayMs?: number;
};

export function useTextInputPracticeView<TCard extends TextInputSessionCard>({
                                                                               cards,
                                                                               index,
                                                                               locked,
                                                                               isFinished,
                                                                               feedback,
                                                                               next,
                                                                               onAutoNext,
                                                                               autoNextCommitDelayMs,
                                                                             }: Params<TCard>) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!locked) {
      inputRef.current?.focus();
    }
  }, [index, locked]);

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