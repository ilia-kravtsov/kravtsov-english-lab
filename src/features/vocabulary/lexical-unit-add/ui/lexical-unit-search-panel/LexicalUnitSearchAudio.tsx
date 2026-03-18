import type { RefObject } from 'react';

import { Button } from '@/shared/ui';

import style from './LexicalUnitSearchPanel.module.scss';

type Props = {
  audioRef: RefObject<HTMLAudioElement | null>;
  audioSrc: string;
  title: string;
  onPlay: () => void;
};

const mediaButtonStyle = { width: '80px' };

export function LexicalUnitSearchAudio({ audioRef, audioSrc, title, onPlay }: Props) {
  return (
    <div className={style.fieldBlock}>
      <audio ref={audioRef} src={audioSrc} preload={'metadata'} hidden />
      <Button type={'button'} title={title} onClick={onPlay} style={mediaButtonStyle} />
    </div>
  );
}
