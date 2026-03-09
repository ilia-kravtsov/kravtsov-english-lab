import { type Dispatch, type KeyboardEvent, type SetStateAction } from 'react';

import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import type {
  PracticeSwitchDir,
  PracticeSwitchState,
} from '@/features/vocabulary/card-practice/model/practice-mode.types';
import { useStandardPractice } from '@/features/vocabulary/card-practice/standard/model/useStandardPractice.ts';
import { practiceButtonStyles } from '@/features/vocabulary/card-practice/ui/practice-button.styles';
import { Button } from '@/shared/ui';

import style from './StandardPractice.module.scss';

type Props = {
  items: CardWithLexicalUnit[];
  index: number;
  isFlipped: boolean;
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
  setIndex: Dispatch<SetStateAction<number>>;
  switchDir: PracticeSwitchState;
  triggerSwitch: (dir: PracticeSwitchDir) => void;
};

export function StandardPractice({
  items,
  index,
  isFlipped,
  setIsFlipped,
  setIndex,
  switchDir,
  triggerSwitch,
}: Props) {
  const {
    audioRef,
    current,
    unit,
    isLastCard,
    audioSrc,
    hasBackContent,
    next,
    prev,
    restart,
    toggleFlip,
    playHandler,
  } = useStandardPractice({
    items,
    index,
    isFlipped,
    setIsFlipped,
    setIndex,
    switchDir,
    triggerSwitch,
  });

  function handleCardKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      toggleFlip();
    }
  }

  const flipStyles = [
    style.flipInner,
    switchDir === 'next' ? style.flipInnerSwitchNext : '',
    switchDir === 'prev' ? style.flipInnerSwitchPrev : '',
  ].join(' ');

  return (
    <div className={style.standardContainer}>
      <div
        className={isFlipped ? style.flipCardFlipped : style.flipCard}
        role={'button'}
        tabIndex={0}
        onClick={toggleFlip}
        onKeyDown={handleCardKeyDown}
      >
        <div className={flipStyles}>
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
