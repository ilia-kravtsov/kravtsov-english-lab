import { Button, Input } from '@/shared/ui';
import style from './TypingPractice.module.scss';
import { useEffect, useRef } from 'react';
import { useTypingStore } from '../model/typing.store';
import { useAutoNextOnCorrect } from '@/features/vocabulary/card-practice/shared/model/useAutoNextOnCorrect.ts';
import switchAnim from '@/features/vocabulary/card-practice/shared/ui/SwitchAnimation.module.scss';
import type { PracticeSwitchState } from '@/features/vocabulary/card-practice/model/practice-mode.types.ts';
import { PracticeResults } from '@/features/vocabulary/card-practice/shared/ui/PracticeResults/PracticeResults.tsx';

type Props = {
  switchDir?: PracticeSwitchState;
  onAutoNext?: () => void;
  autoNextCommitDelayMs?: number;
}

export function TypingPractice({switchDir, onAutoNext, autoNextCommitDelayMs}: Props) {
  const cards = useTypingStore(s => s.cards);
  const index = useTypingStore(s => s.index);
  const feedback = useTypingStore(s => s.feedback);
  const locked = useTypingStore(s => s.locked);

  const input = useTypingStore(s => s.input);
  const setInput = useTypingStore(s => s.setInput);

  const attempts = useTypingStore(s => s.attempts);

  const isFinished = useTypingStore(s => s.isFinished);
  const cardSetId = useTypingStore(s => s.cardSetId);

  const submit = useTypingStore(s => s.submit);
  const skip = useTypingStore(s => s.skip);
  const next = useTypingStore(s => s.next);
  const restart = useTypingStore(s => s.restart);

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
  const unit = current?.lexicalUnit ?? null;

  if (!cardSetId) return null;

  if (isFinished) {
    return (
      <PracticeResults
        cardSetId={cardSetId}
        mode={"typing"}
        restart={restart}
        restartTitle={"Restart Typing"}
      />
    );
  }

  if (!current || !unit) return null;

  return (
    <div className={style.wrap}>
      <div
        className={[
          style.card,
          switchDir === 'next' ? switchAnim.switchNext : '',
          switchDir === 'prev' ? switchAnim.switchPrev : '',
          feedback === 'correct' ? style.cardCorrect : '',
          feedback === 'wrong' ? style.cardWrong : '',
        ].join(' ')}
      >
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
          onChange={e => setInput(e.target.value)}
          placeholder={'Type lexical unit'}
          disabled={locked}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
        />

        <div className={style.buttonsContainer}>
          <Button title={'Check'} onClick={submit} disabled={locked} style={{ width: '100px', fontSize: '16px'}} />
          <Button title={'Skip'} onClick={skip} style={{ width: '100px', fontSize: '16px' }} />
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