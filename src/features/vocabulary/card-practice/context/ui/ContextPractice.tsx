import { Button, Input } from '@/shared/ui';
import style from './ContextPractice.module.scss';
import { useRef, useEffect } from 'react';
import { useContextStore } from '../model/context.store';
import { useAutoNextOnCorrect } from '@/features/vocabulary/card-practice/shared/useAutoNextOnCorrect.ts';
import type { Flip } from '@/features/vocabulary/card-practice/shared/Flip.type.ts';
import switchAnim from '@/features/vocabulary/card-practice/shared/SwitchAnimation.module.scss';
import { ConfettiBurstPetard } from '@/shared/ui/ConfettiBurstPetard/ConfettiBurstPetard.tsx';

type Props = {
  switchDir?: Flip;
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
  const getStoredContext = useContextStore(s => s.getStoredContext);

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
    const c = getStoredContext(cardSetId);
    return (
      <div className={style.result}>
        <ConfettiBurstPetard />
        <h3 className={style.sectionTitle}>Results</h3>

        <div className={style.resultBlock}>
          <div className={style.resultRow}>
            <div className={style.resultLabel}>Context</div>
            <div className={style.resultValue}>
              {c ? `${c.correctCards}/${c.totalCards} (${c.accuracy}%) · avg ${c.avgTimeMs}ms` : 'Not started'}
            </div>
          </div>
        </div>

        <div className={style.controlsRow}>
          <Button title={'Restart Context'} onClick={restart} style={{ width: '180px' }} />
        </div>
      </div>
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
