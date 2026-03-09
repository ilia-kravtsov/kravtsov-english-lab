import type { PracticeSwitchState } from '@/features/vocabulary/card-practice/model/practice-mode.types';
import { useTextInputPracticeHandlers } from '@/features/vocabulary/card-practice/shared/model/useTextInputPracticeHandlers.ts';
import { useTextInputPracticeView } from '@/features/vocabulary/card-practice/shared/model/useTextInputPracticeView';
import { PracticeResults } from '@/features/vocabulary/card-practice/shared/ui/PracticeResults/PracticeResults';
import { Button, Input } from '@/shared/ui';
import { mediumButtonStyles } from '@/shared/ui/ButtonStyles/logout-button.styles.ts';

import { useTypingStore } from '../model/typing.store';
import style from './TypingPractice.module.scss';

type Props = {
  switchDir?: PracticeSwitchState;
  onAutoNext?: () => void;
  autoNextCommitDelayMs?: number;
};

export function TypingPractice({ switchDir, onAutoNext, autoNextCommitDelayMs }: Props) {
  const cards = useTypingStore((s) => s.cards);
  const index = useTypingStore((s) => s.index);
  const feedback = useTypingStore((s) => s.feedback);
  const locked = useTypingStore((s) => s.locked);

  const input = useTypingStore((s) => s.input);
  const setInput = useTypingStore((s) => s.setInput);

  const attempts = useTypingStore((s) => s.attempts);

  const isFinished = useTypingStore((s) => s.isFinished);
  const cardSetId = useTypingStore((s) => s.cardSetId);

  const submit = useTypingStore((s) => s.submit);
  const skip = useTypingStore((s) => s.skip);
  const next = useTypingStore((s) => s.next);
  const restart = useTypingStore((s) => s.restart);

  const { inputRef, current } = useTextInputPracticeView({
    cards,
    index,
    locked,
    isFinished,
    feedback,
    next,
    onAutoNext,
    autoNextCommitDelayMs,
  });

  const { cardStyles, handleInputChange, handleInputKeyDown } = useTextInputPracticeHandlers({
    style,
    switchDir,
    feedback,
    setInput,
    submit,
  });

  const unit = current?.lexicalUnit ?? null;

  if (!cardSetId) return null;

  if (isFinished) {
    return (
      <PracticeResults cardSetId={cardSetId} restart={restart} restartTitle={'Restart Typing'} />
    );
  }

  if (!current || !unit) return null;

  return (
    <div className={style.wrap}>
      <div className={cardStyles}>
        <div className={style.promptLabel}>Translate:</div>
        <div className={style.promptValue}>{unit.translation}</div>
        <div className={style.hint}>
          <div className={style.hintLabel}>Meaning in English</div>
          <div className={style.hintValue}>{unit.meaning ?? '—'}</div>
        </div>
      </div>

      <div className={style.formRow}>
        <Input
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          placeholder={'Type lexical unit'}
          disabled={locked}
          onKeyDown={handleInputKeyDown}
        />

        <div className={style.buttonsContainer}>
          <Button title={'Check'} onClick={submit} disabled={locked} style={mediumButtonStyles} />
          <Button title={'Skip'} onClick={skip} style={mediumButtonStyles} />
        </div>
      </div>

      <div className={style.controlsRow}>
        <div className={style.counter}>
          {index + 1} / {cards.length}
        </div>
        <div className={style.meta}>Attempts: {attempts}</div>
      </div>
    </div>
  );
}
