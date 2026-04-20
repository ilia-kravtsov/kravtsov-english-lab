import type { PracticeViewProps } from '@/features/vocabulary/card-practice/shared/model/practice-view.types';
import { usePracticeView } from '@/features/vocabulary/card-practice/shared/model/use-practice-view';
import { useTextInputPracticeHandlers } from '@/features/vocabulary/card-practice/shared/model/use-text-input-practice-handlers';
import { PracticeGuard } from '@/features/vocabulary/card-practice/shared/ui/PracticeGuard';
import { PracticeProgress } from '@/features/vocabulary/card-practice/shared/ui/PracticeProgress';
import { Button, Input } from '@/shared/ui';

import { useContextStore } from '../model/context.store';
import styles from './../../shared/ui/CommonHint.module.scss';
import style from './ContextPractice.module.scss';

export function ContextPractice({
  switchDir,
  onAutoNext,
  autoNextCommitDelayMs,
}: PracticeViewProps) {
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

  const { inputRef, current } = usePracticeView({
    cards,
    index,
    locked,
    isFinished,
    feedback,
    next,
    onAutoNext,
    autoNextCommitDelayMs,
    withInputFocus: true,
  });

  const { cardStyles, handleInputChange, handleInputKeyDown } = useTextInputPracticeHandlers({
    style,
    switchDir,
    feedback,
    setInput,
    submit,
  });

  const unit = current?.lexicalUnit ?? null;

  return (
    <PracticeGuard
      cardSetId={cardSetId}
      isFinished={isFinished}
      restart={restart}
      restartTitle={'Restart Context'}
      isReady={Boolean(current && unit)}
    >
      <div className={style.wrap}>
        <div className={cardStyles}>
          <div className={style.promptLabel}>Fill the gap:</div>
          <div className={style.promptValue}>{current?.contextMasked}</div>
          <div className={styles.hint}>
            <div className={styles.hintLabel}>Hint</div>
            <div className={styles.hintValue}>{current?.lexicalUnit.translation}</div>
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
            style={{ fontSize: '24px' }}
          />
          <Button title={'Check'} onClick={submit} disabled={locked} />
          <Button title={'Skip'} onClick={skip} />
        </div>

        <PracticeProgress index={index} total={cards.length} attempts={attempts} />
      </div>
    </PracticeGuard>
  );
}
