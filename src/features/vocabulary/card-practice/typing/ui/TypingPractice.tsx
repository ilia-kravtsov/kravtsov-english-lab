import type { PracticeViewProps } from '@/features/vocabulary/card-practice/shared/model/practice-view.types';
import { usePracticeView } from '@/features/vocabulary/card-practice/shared/model/usePracticeView';
import { useTextInputPracticeHandlers } from '@/features/vocabulary/card-practice/shared/model/useTextInputPracticeHandlers';
import { PracticeGuard } from '@/features/vocabulary/card-practice/shared/ui/PracticeGuard';
import { PracticeProgress } from '@/features/vocabulary/card-practice/shared/ui/PracticeProgress';
import { Button, Input } from '@/shared/ui';
import { mediumButtonStyles } from '@/shared/ui/ButtonStyles/button.styles';

import { useTypingStore } from '../model/typing.store';
import style from './TypingPractice.module.scss';

export function TypingPractice({
  switchDir,
  onAutoNext,
  autoNextCommitDelayMs,
}: PracticeViewProps) {

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
      restartTitle={'Restart Typing'}
      isReady={Boolean(current && unit)}
    >
      <div className={style.wrap}>
        <div className={cardStyles}>
          <div className={style.promptLabel}>Translate:</div>
          <div className={style.promptValue}>{unit?.translation}</div>
          <div className={style.hint}>
            <div className={style.hintLabel}>{unit?.meaning && 'Meaning in English'}</div>
            <div className={style.hintValue}>{unit?.meaning}</div>
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

        <PracticeProgress index={index} total={cards.length} attempts={attempts} style={style} />
      </div>
    </PracticeGuard>
  );
}
