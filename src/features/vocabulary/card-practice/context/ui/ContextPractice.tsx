import type { PracticeSwitchState } from '@/features/vocabulary/card-practice/model/practice-mode.types';
import { useTextInputPracticeHandlers } from '@/features/vocabulary/card-practice/shared/model/useTextInputPracticeHandlers.ts';
import { useTextInputPracticeView } from '@/features/vocabulary/card-practice/shared/model/useTextInputPracticeView';
import { PracticeResults } from '@/features/vocabulary/card-practice/shared/ui/PracticeResults/PracticeResults';
import { Button, Input } from '@/shared/ui';

import { useContextStore } from '../model/context.store';
import style from './ContextPractice.module.scss';
import { normalButtonWide } from '@/shared/ui/ButtonStyles/button.styles.ts';

type Props = {
  switchDir?: PracticeSwitchState;
  onAutoNext?: () => void;
  autoNextCommitDelayMs?: number;
};

export function ContextPractice({ switchDir, onAutoNext, autoNextCommitDelayMs }: Props) {
  const cards = useContextStore((s) => s.cards);
  const index = useContextStore((s) => s.index);
  const feedback = useContextStore((s) => s.feedback);
  const locked = useContextStore((s) => s.locked);

  const input = useContextStore((s) => s.input);
  const setInput = useContextStore((s) => s.setInput);

  const attempts = useContextStore((s) => s.attempts);

  const isFinished = useContextStore((s) => s.isFinished);
  const cardSetId = useContextStore((s) => s.cardSetId);

  const submit = useContextStore((s) => s.submit);
  const skip = useContextStore((s) => s.skip);
  const next = useContextStore((s) => s.next);
  const restart = useContextStore((s) => s.restart);

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

  if (!cardSetId) return null;

  if (isFinished) {
    return (
      <PracticeResults cardSetId={cardSetId} restart={restart} restartTitle={"Restart Context"} />
    );
  }

  if (!current) return null;

  return (
    <div className={style.wrap}>
      <div className={cardStyles}>
        <div className={style.promptLabel}>Fill the gap:</div>
        <div className={style.promptValue}>{current.contextMasked}</div>
        <div className={style.hint}>
          <div className={style.hintLabel}>Hint</div>
          <div className={style.hintValue}>{current.lexicalUnit.translation ?? '—'}</div>
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
        <Button title={'Check'} onClick={submit} disabled={locked} style={normalButtonWide} />
        <Button title={'Skip'} onClick={skip} style={normalButtonWide} />
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
