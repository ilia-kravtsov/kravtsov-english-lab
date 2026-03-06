import { Button, Input } from '@/shared/ui';
import style from './ContextPractice.module.scss';
import { useEffect, useRef } from 'react';
import { useContextStore } from '../model/context.store';
import { useAutoNextOnCorrect } from '@/features/vocabulary/card-practice/shared/model/useAutoNextOnCorrect.ts';
import switchAnim from '@/features/vocabulary/card-practice/shared/ui/SwitchAnimation.module.scss';
import type { PracticeSwitchState } from '@/features/vocabulary/card-practice/model/practice-mode.types.ts';
import { PracticeResults } from '@/features/vocabulary/card-practice/shared/ui/PracticeResults/PracticeResults.tsx';

type Props = {
  switchDir?: PracticeSwitchState;
  onAutoNext?: () => void;
  autoNextCommitDelayMs?: number;
};

export function ContextPractice({switchDir, onAutoNext, autoNextCommitDelayMs}: Props) {
  const cards = useContextStore(s => s.cards);
  const index = useContextStore(s => s.index);
  const feedback = useContextStore(s => s.feedback);
  const locked = useContextStore(s => s.locked);

  const input = useContextStore(s => s.input);
  const setInput = useContextStore(s => s.setInput);

  const attempts = useContextStore(s => s.attempts);

  const isFinished = useContextStore(s => s.isFinished);
  const cardSetId = useContextStore(s => s.cardSetId);

  const submit = useContextStore(s => s.submit);
  const skip = useContextStore(s => s.skip);
  const next = useContextStore(s => s.next);
  const restart = useContextStore(s => s.restart);

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

  if (!cardSetId) return null;

  if (isFinished) {
    return (
      <PracticeResults
        cardSetId={cardSetId}
        restart={restart}
        restartTitle="Restart Context"
      />
    );
  }

  if (!current) return null;

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
        <Button title={'Check'} onClick={submit} disabled={locked} style={{ width: '120px' }} />
        <Button title={'Skip'} onClick={skip} style={{ width: '120px' }} />
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
