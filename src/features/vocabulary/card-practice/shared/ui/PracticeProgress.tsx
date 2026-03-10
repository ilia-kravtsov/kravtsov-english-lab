import { type JSX } from 'react';

type Props = {
  index: number;
  total: number;
  attempts: number;
  style: CSSModuleClasses;
};

export function PracticeProgress({ index, total, attempts, style }: Props): JSX.Element {
  return (
    <div className={style.controlsRow}>
      <div className={style.counter}>
        {index + 1} / {total}
      </div>
      <div className={style.meta}>Attempts: {attempts}</div>
    </div>
  );
}