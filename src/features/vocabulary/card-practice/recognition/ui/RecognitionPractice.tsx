import { getPracticeCardClassName } from '@/features/vocabulary/card-practice/shared/lib/get-practice-card-styles.ts';
import type { PracticeViewProps } from '@/features/vocabulary/card-practice/shared/model/practice-view.types';
import { usePracticeView } from '@/features/vocabulary/card-practice/shared/model/use-practice-view.ts';
import { PracticeGuard } from '@/features/vocabulary/card-practice/shared/ui/PracticeGuard';
import { PracticeProgress } from '@/features/vocabulary/card-practice/shared/ui/PracticeProgress';
import switchAnim from '@/features/vocabulary/card-practice/shared/ui/SwitchAnimation.module.scss';

import { useRecognitionStore } from '../model/recognition.store';
import { norm } from '../model/recognition.utils';
import style from './RecognitionPractice.module.scss';

export function RecognitionPractice({
  switchDir,
  onAutoNext,
  autoNextCommitDelayMs,
}: PracticeViewProps) {

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

  const { current } = usePracticeView({
    cards,
    index,
    locked,
    isFinished,
    feedback,
    next,
    onAutoNext,
    autoNextCommitDelayMs,
  });

  const unit = current?.lexicalUnit ?? null;

  const correct = norm(unit?.translation ?? '');

  const cardStyles = getPracticeCardClassName(style, switchAnim, switchDir, feedback);

  return (
    <PracticeGuard
      cardSetId={cardSetId}
      isFinished={isFinished}
      restart={restart}
      restartTitle={'Restart Recognition'}
      isReady={Boolean(current && unit)}
    >
      <div className={style.wrap}>
        <div className={cardStyles}>
          <div className={style.value}>{unit?.value}</div>
        </div>

        <div className={style.options}>
          {options.map((opt) => {
            const v = norm(opt);
            const isDisabled = Boolean(disabled[v]) || feedback === 'correct';
            const isCorrect = feedback === 'correct' && v === correct;
            const isWrong = Boolean(disabled[v]);
            const stylesOptionButton = [
              style.optionBtn,
              isCorrect ? style.optionCorrect : '',
              isWrong ? style.optionWrong : '',
            ].join(' ');

            return (
              <button
                key={v}
                type={'button'}
                className={stylesOptionButton}
                disabled={isDisabled}
                onClick={() => answer(v)}
              >
                {v}
              </button>
            );
          })}
        </div>

        <PracticeProgress
          index={index}
          total={cards.length}
          attempts={attempts}
        />
      </div>
    </PracticeGuard>
  );
}
