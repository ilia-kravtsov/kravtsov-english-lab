import clsx from 'clsx';
import type { ChangeEvent, KeyboardEvent } from 'react';

import type { PracticeSwitchState } from '@/features/vocabulary/card-practice/shared/model/practice-mode.types.ts';
import type { TextInputFeedback } from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types.ts';
import switchAnim from '@/features/vocabulary/card-practice/shared/ui/SwitchAnimation.module.scss';

type Params = {
  style: Record<string, string>;
  switchDir: PracticeSwitchState | undefined;
  feedback: TextInputFeedback;
  setInput: (value: string) => void;
  submit: () => void;
};

export function useTextInputPracticeHandlers({
  style,
  switchDir,
  feedback,
  setInput,
  submit,
}: Params) {
  const cardStyles = clsx(
    style.card,
    switchDir === 'next' && switchAnim.switchNext,
    switchDir === 'prev' && switchAnim.switchPrev,
    feedback === 'correct' && style.cardCorrect,
    feedback === 'wrong' && style.cardWrong,
  );

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function handleInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  }

  return {
    cardStyles,
    handleInputChange,
    handleInputKeyDown,
  };
}
