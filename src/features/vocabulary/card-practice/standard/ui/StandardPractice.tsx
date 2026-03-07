import {
  type Dispatch,
  type MouseEvent,
  type SetStateAction,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import type {
  PracticeSwitchDir,
  PracticeSwitchState,
} from '@/features/vocabulary/card-practice/model/practice-mode.types';
import { practiceButtonStyles } from '@/features/vocabulary/card-practice/ui/practice-button.styles';
import { Button } from '@/shared/ui';

import style from './StandardPractice.module.scss';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type Props = {
  items: CardWithLexicalUnit[];
  index: number;
  isFlipped: boolean;
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
  setIndex: Dispatch<SetStateAction<number>>;
  switchDir: PracticeSwitchState;
  triggerSwitch: (dir: PracticeSwitchDir) => void;
};

function toAbsoluteMediaUrl(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${apiBaseUrl}${url}`;
}

export function StandardPractice({
  items,
  index,
  isFlipped,
  setIsFlipped,
  setIndex,
  switchDir,
  triggerSwitch,
}: Props) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  function animateSwitch(dir: PracticeSwitchDir, commit: () => void) {
    if (items.length === 0) return;
    if (switchDir) return;

    setIsFlipped(false);
    triggerSwitch(dir);

    window.setTimeout(() => {
      commit();
    }, 130);
  }

  function next() {
    if (index >= items.length - 1) return;

    animateSwitch('next', () => {
      setIndex((i) => Math.min(i + 1, items.length - 1));
    });
  }

  function prev() {
    if (index <= 0) return;

    animateSwitch('prev', () => {
      setIndex((i) => Math.max(i - 1, 0));
    });
  }

  function restart() {
    if (items.length === 0) return;
    if (switchDir) return;
    if (index === 0 && !isFlipped) return;

    animateSwitch('prev', () => {
      setIndex(0);
    });
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName?.toLowerCase();

      if (tag === 'input' || tag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((v) => !v);
        return;
      }

      if (e.key === 'ArrowRight') {
        if (switchDir) return;
        if (index < items.length - 1) {
          e.preventDefault();
          next();
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        if (switchDir) return;
        if (index > 0) {
          e.preventDefault();
          prev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [index, items.length, switchDir]);

  const current = items[index] ?? null;
  const unit = current?.lexicalUnit ?? null;
  const isLastCard = index >= items.length - 1;

  const audioSrc = useMemo(() => {
    const url = unit?.audioUrl;
    if (!url) return null;
    return toAbsoluteMediaUrl(url);
  }, [unit]);

  const hasBackContent = Boolean(unit?.translation || unit?.synonyms?.length || unit?.meaning);

  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    void audioRef.current.play();
  };

  const playHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    playAudio();
  };

  return (
    <div className={style.standardContainer}>
      <div
        className={isFlipped ? style.flipCardFlipped : style.flipCard}
        role={'button'}
        tabIndex={0}
        onClick={() => setIsFlipped((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') setIsFlipped((v) => !v);
        }}
      >
        <div
          className={[
            style.flipInner,
            switchDir === 'next' ? style.flipInnerSwitchNext : '',
            switchDir === 'prev' ? style.flipInnerSwitchPrev : '',
          ].join(' ')}
        >
          <div className={style.cardFaceFront}>
            <div className={style.frontTop}>
              <div className={style.value}>{unit?.value ?? current?.lexicalUnitId}</div>
            </div>

            <div className={style.frontBottom}>
              {audioSrc && (
                <>
                  <audio ref={audioRef} src={audioSrc} preload={'metadata'} />
                  <Button
                    type={'button'}
                    onClick={playHandler}
                    title={'Play'}
                    style={practiceButtonStyles}
                  />
                </>
              )}
              {!audioSrc && <div className={style.muted}> </div>}
            </div>
          </div>

          <div className={style.cardFaceBack}>
            <div className={style.backContent}>
              {unit?.translation && (
                <div className={style.backRow}>
                  <div className={style.backValue}>{unit.translation}</div>
                </div>
              )}

              {unit?.synonyms?.length && (
                <div className={style.backRow}>
                  <div className={style.backValue}>{unit.synonyms.join(', ')}</div>
                </div>
              )}

              {unit?.meaning && (
                <div className={style.backRow}>
                  <div className={style.backValue}>{unit.meaning}</div>
                </div>
              )}

              {Array.isArray(unit?.examples) && unit.examples.length > 0 && (
                <div className={style.backRow}>
                  <div className={style.backValue}>
                    {unit.examples.map((ex, i) => (
                      <div key={i}>{ex}</div>
                    ))}
                  </div>
                </div>
              )}

              {!hasBackContent && <div className={style.muted}>No details</div>}
            </div>
          </div>
        </div>
      </div>

      <div className={style.controlsRow}>
        <Button
          type={'button'}
          title={'Prev'}
          onClick={prev}
          disabled={index === 0}
          style={practiceButtonStyles}
        />
        <div className={style.counter}>
          {index + 1} / {items.length}
        </div>
        {isLastCard ? (
          <Button
            type={'button'}
            title={'Restart'}
            onClick={restart}
            style={practiceButtonStyles}
          />
        ) : (
          <Button
            type={'button'}
            title={'Next'}
            onClick={next}
            disabled={index >= items.length - 1}
            style={practiceButtonStyles}
          />
        )}
      </div>
    </div>
  );
}
