import { Button, Input } from '@/shared/ui';
import style from './TypingPractice.module.scss';
import { useTypingStore } from '../model/typing.store';
import { useAutoNextOnCorrect } from '@/features/vocabulary/card-practice/shared/useAutoNextOnCorrect.ts';
import switchAnim from '@/features/vocabulary/card-practice/shared/SwitchAnimation.module.scss';
import type { Flip } from '@/features/vocabulary/card-practice/shared/Flip.type.ts';

type Props = {
  switchDir?: Flip;
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
  const getStoredTyping = useTypingStore(s => s.getStoredTyping);

  const submit = useTypingStore(s => s.submit);
  const skip = useTypingStore(s => s.skip);
  const next = useTypingStore(s => s.next);
  const restart = useTypingStore(s => s.restart);

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
    const t = getStoredTyping(cardSetId);
    return (
      <div className={style.result}>
        <h3 className={style.sectionTitle}>Results</h3>

        <div className={style.resultBlock}>
          <div className={style.resultRow}>
            <div className={style.resultLabel}>Typing</div>
            <div className={style.resultValue}>
              {t ? `${t.correctCards}/${t.totalCards} (${t.accuracy}%) · avg ${t.avgTimeMs}ms` : 'Not started'}
            </div>
          </div>

          <div className={style.resultRow}>
            <div className={style.resultLabel}>Recognition</div>
            <div className={style.resultValue}>See summary screen</div>
          </div>

          <div className={style.resultRow}>
            <div className={style.resultLabel}>Listening</div>
            <div className={style.resultValue}>Not started</div>
          </div>

          <div className={style.resultRow}>
            <div className={style.resultLabel}>Context</div>
            <div className={style.resultValue}>Not started</div>
          </div>
        </div>

        <div className={style.controlsRow}>
          <Button title={'Restart Typing'} onClick={restart} style={{ width: '180px' }} />
        </div>
      </div>
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
          <Button title={'Check'} onClick={submit} disabled={locked} style={{ width: '120px' }} />
          <Button title={'Skip'} onClick={skip} style={{ width: '120px' }} />
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