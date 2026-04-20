import type { ReactNode } from 'react';

import { Button } from '@/shared/ui';

import style from './CardSetsPageHeader.module.scss';

type Props = {
  title: string;
  onBackClick: () => void;
  backTitle?: string;
  children?: ReactNode;
};

export function CardSetsPageHeader({
  title,
  onBackClick,
  backTitle = 'Back',
  children,
}: Props) {
  return (
    <div className={style.headerRow}>
      <div className={style.headerLeft}>
        <Button title={backTitle} onClick={onBackClick} />
        {children}
        <h2 className={style.title}>{title}</h2>
      </div>
    </div>
  );
}
