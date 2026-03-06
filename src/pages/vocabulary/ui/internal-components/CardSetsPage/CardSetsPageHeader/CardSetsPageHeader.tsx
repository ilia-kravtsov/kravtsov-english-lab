import type { CSSProperties, ReactNode } from 'react';
import { Button } from '@/shared/ui';
import style from './CardSetsPageHeader.module.scss';

type Props = {
  title: string;
  onBackClick: () => void;
  backTitle?: string;
  backButtonStyle?: CSSProperties;
  children?: ReactNode;
};

export function CardSetsPageHeader({
                                       title,
                                       onBackClick,
                                       backTitle = 'Back',
                                       backButtonStyle,
                                       children,
                                     }: Props) {
  return (
    <div className={style.headerRow}>
      <div className={style.headerLeft}>
        <Button
          title={backTitle}
          onClick={onBackClick}
          style={backButtonStyle}
        />
        {children}
        <h2 className={style.title}>{title}</h2>
      </div>
    </div>
  );
}