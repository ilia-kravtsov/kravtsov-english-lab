import { type JSX } from 'react';

import style from './PracticeProgress.module.scss';

type Props = {
  index: number;
  total: number;
  attempts: number;
};

export function PracticeProgress({ index, total, attempts }: Props): JSX.Element {
  return (
    <div className={style.controlsRow}>
      <div className={style.attempts}>Attempts: {attempts}</div>
      <div className={style.counter}>
        {index + 1} / {total}
      </div>
    </div>
  );
}
