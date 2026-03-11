import { type Dispatch, type KeyboardEvent, type SetStateAction } from 'react';

import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import type {
  PracticeSwitchDir,
  PracticeSwitchState,
} from '@/features/vocabulary/card-practice/model/practice-mode.types';
import { useStandardPractice } from '@/features/vocabulary/card-practice/standard/model/use-standard-practice.ts';
import { StandardPracticeBack } from '@/features/vocabulary/card-practice/standard/ui/StandardPracticeBack';
import { StandardPracticeControls } from '@/features/vocabulary/card-practice/standard/ui/StandardPracticeControls';
import { StandardPracticeFront } from '@/features/vocabulary/card-practice/standard/ui/StandardPracticeFront';

import style from './StandardPractice.module.scss';

type Props = {
  items: CardWithLexicalUnit[];
  index: number;
  isFlipped: boolean;
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
  setIndex: Dispatch<SetStateAction<number>>;
  switchDir?: PracticeSwitchState;
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

  const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== 'Enter') return;
    e.preventDefault();
    toggleFlip();
  };

  const flipStyles = [
    style.flipInner,
    switchDir === 'next' ? style.flipInnerSwitchNext : '',
    switchDir === 'prev' ? style.flipInnerSwitchPrev : '',
  ].join(' ');

  const frontValue = unit?.value ?? current?.lexicalUnitId ?? '';

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
          <StandardPracticeFront
            value={frontValue}
            audioRef={audioRef}
            audioSrc={audioSrc}
            onPlay={playHandler}
          />

          <StandardPracticeBack unit={unit} hasBackContent={hasBackContent} />
        </div>
      </div>

      <StandardPracticeControls
        index={index}
        total={items.length}
        isLastCard={isLastCard}
        onPrev={prev}
        onNext={next}
        onRestart={restart}
      />
    </div>
  );
}
