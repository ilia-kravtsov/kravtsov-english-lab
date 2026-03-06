import { Button } from '@/shared/ui';
import style from './RecognitionPractice.module.scss';
import { useRecognitionStore } from '../model/recognition.store';
import { norm } from '../model/recognition.utils';
import { useAutoNextOnCorrect } from '@/features/vocabulary/card-practice/shared/useAutoNextOnCorrect.ts';
import switchAnim from '@/features/vocabulary/card-practice/shared/SwitchAnimation.module.scss';
import type { Flip } from '@/features/vocabulary/card-practice/shared/Flip.type.ts';
import { ConfettiBurstPetard } from '@/shared/ui/ConfettiBurstPetard/ConfettiBurstPetard.tsx';

type Props = {
  switchDir?: Flip;
  onAutoNext?: () => void;
  autoNextCommitDelayMs?: number;
};

export function RecognitionPractice({switchDir, onAutoNext, autoNextCommitDelayMs}:Props) {
  const cards = useRecognitionStore(s => s.cards);
  const index = useRecognitionStore(s => s.index);
  const feedback = useRecognitionStore(s => s.feedback);
  const locked = useRecognitionStore(s => s.locked);

  const options = useRecognitionStore(s => s.options);
  const disabled = useRecognitionStore(s => s.disabled);

  const attempts = useRecognitionStore(s => s.attempts);

  const isFinished = useRecognitionStore(s => s.isFinished);
  const cardSetId = useRecognitionStore(s => s.cardSetId);
  const getStoredRecognition = useRecognitionStore(s => s.getStoredRecognition);

  const answer = useRecognitionStore(s => s.answer);
  const next = useRecognitionStore(s => s.next);
  const restart = useRecognitionStore(s => s.restart);

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
    const r = getStoredRecognition(cardSetId);
    return (
      <div className={style.result}>
        <ConfettiBurstPetard />
        <h3 className={style.sectionTitle}>Results</h3>

        <div className={style.resultBlock}>
          <div className={style.resultRow}>
            <div className={style.resultLabel}>Recognition</div>
            <div className={style.resultValue}>
              {r ? `${r.correctCards}/${r.totalCards} (${r.accuracy}%) · avg ${r.avgTimeMs}ms` : 'Not started'}
            </div>
          </div>

          <div className={style.resultRow}>
            <div className={style.resultLabel}>Typing</div>
            <div className={style.resultValue}>Not started</div>
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
          <Button title={'Restart Recognition'} onClick={restart} style={{ width: '200px' }} />
        </div>
      </div>
    );
  }

  if (!current || !unit) return null;

  const correct = norm(unit.translation ?? '');

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
        <div className={style.value}>{unit.value}</div>
      </div>

      <div className={style.options}>
        {options.map(opt => {
          const v = norm(opt);
          const isDisabled = Boolean(disabled[v]) || feedback === 'correct';
          const isCorrect = feedback === 'correct' && v === correct;
          const isWrong = Boolean(disabled[v]);

          return (
            <button
              key={v}
              type={'button'}
              className={[style.optionBtn, isCorrect ? style.optionCorrect : '', isWrong ? style.optionWrong : ''].join(
                ' '
              )}
              disabled={isDisabled}
              onClick={() => answer(v)}
            >
              {v}
            </button>
          );
        })}
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