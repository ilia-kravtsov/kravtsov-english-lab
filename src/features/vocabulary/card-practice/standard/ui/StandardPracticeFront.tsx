import type { MouseEvent, RefObject } from 'react';

import { practiceButtonStyles } from '@/shared/lib/styles/button.styles.ts';
import { Button } from '@/shared/ui';

import style from './StandardPractice.module.scss';

type Props = {
  value: string;
  audioRef: RefObject<HTMLAudioElement | null>;
  audioSrc: string | null;
  onPlay: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
};

export function StandardPracticeFront({ value, audioRef, audioSrc, onPlay }: Props) {
  return (
    <div className={style.cardFaceFront}>
      <div className={style.frontTop}>
        <div className={style.value}>{value}</div>
      </div>

      <div className={style.frontBottom}>
        {audioSrc ? (
          <>
            <audio ref={audioRef} src={audioSrc} preload={'metadata'} />
            <Button type={'button'} onClick={onPlay} title={'Play'} style={practiceButtonStyles} />
          </>
        ) : (
          <div className={style.muted}> </div>
        )}
      </div>
    </div>
  );
}
