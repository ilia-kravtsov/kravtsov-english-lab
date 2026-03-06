import type { PracticeSwitchState } from '@/features/vocabulary/card-practice/model/practice-mode.types.ts';
import { useAutoNextOnCorrect } from '@/features/vocabulary/card-practice/shared/model/useAutoNextOnCorrect.ts';
import { PracticeResults } from '@/features/vocabulary/card-practice/shared/ui/PracticeResults/PracticeResults.tsx';
import switchAnim from '@/features/vocabulary/card-practice/shared/ui/SwitchAnimation.module.scss';

import { useRecognitionStore } from '../model/recognition.store';
import { norm } from '../model/recognition.utils';
import style from './RecognitionPractice.module.scss';

type Props = {
  switchDir?: PracticeSwitchState;
  onAutoNext?: () => void;
  autoNextCommitDelayMs?: number;
};

export function RecognitionPractice({ switchDir, onAutoNext, autoNextCommitDelayMs }: Props) {
  const cards = useRecognitionStore((s) => s.cards);
  const index = useRecognitionStore((s) => s.index);
  const feedback = useRecognitionStore((s) => s.feedback);
  const locked = useRecognitionStore((s) => s.locked);

  const options = useRecognitionStore((s) => s.options);
  const disabled = useRecognitionStore((s) => s.disabled);

  const attempts = useRecognitionStore((s) => s.attempts);

  const isFinished = useRecognitionStore((s) => s.isFinished);
  const cardSetId = useRecognitionStore((s) => s.cardSetId);

  const answer = useRecognitionStore((s) => s.answer);
  const next = useRecognitionStore((s) => s.next);
  const restart = useRecognitionStore((s) => s.restart);

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
        restart={restart}
        restartTitle={'Restart Recognition'}
      />
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
        {options.map((opt) => {
          const v = norm(opt);
          const isDisabled = Boolean(disabled[v]) || feedback === 'correct';
          const isCorrect = feedback === 'correct' && v === correct;
          const isWrong = Boolean(disabled[v]);

          return (
            <button
              key={v}
              type={'button'}
              className={[
                style.optionBtn,
                isCorrect ? style.optionCorrect : '',
                isWrong ? style.optionWrong : '',
              ].join(' ')}
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
