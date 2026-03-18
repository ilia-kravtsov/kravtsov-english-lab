import { practiceButtonStyles } from '@/shared/lib/styles/button.styles';
import { Button } from '@/shared/ui';

import styles from '../../shared/ui/PracticeProgress.module.scss';
import style from './StandardPractice.module.scss';

type Props = {
  index: number;
  total: number;
  isLastCard: boolean;
  onPrev: () => void;
  onNext: () => void;
  onRestart: () => void;
};

export function StandardPracticeControls({
  index,
  total,
  isLastCard,
  onPrev,
  onNext,
  onRestart,
}: Props) {
  return (
    <div className={style.controlsRow}>
      <Button
        type={'button'}
        title={'Prev'}
        onClick={onPrev}
        disabled={index === 0}
        style={practiceButtonStyles}
      />

      <div className={styles.counter}>
        {index + 1} / {total}
      </div>

      {isLastCard ? (
        <Button
          type={'button'}
          title={'Restart'}
          onClick={onRestart}
          style={practiceButtonStyles}
        />
      ) : (
        <Button
          type={'button'}
          title={'Next'}
          onClick={onNext}
          disabled={index >= total - 1}
          style={practiceButtonStyles}
        />
      )}
    </div>
  );
}
