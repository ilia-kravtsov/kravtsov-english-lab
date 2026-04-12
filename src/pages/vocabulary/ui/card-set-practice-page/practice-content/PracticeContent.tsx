import { type Dispatch, type ReactNode, type SetStateAction } from 'react';

import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import { ContextPractice } from '@/features/vocabulary/card-practice/context/ui/ContextPractice';
import { ListeningPractice } from '@/features/vocabulary/card-practice/listening/ui/ListeningPractice';
import { RecognitionPractice } from '@/features/vocabulary/card-practice/recognition/ui/RecognitionPractice';
import type {
  PracticeMode,
  PracticeSwitchDir,
  PracticeSwitchState,
} from '@/features/vocabulary/card-practice/shared/model/practice-mode.types';
import { StandardPractice } from '@/features/vocabulary/card-practice/standard/ui/StandardPractice';
import { TypingPractice } from '@/features/vocabulary/card-practice/typing/ui/TypingPractice';

import style from './PracticeContent.module.scss';

type Props = {
  mode: PracticeMode;
  loading: boolean;
  items: CardWithLexicalUnit[];
  index: number;
  setIndex: Dispatch<SetStateAction<number>>;
  isFlipped: boolean;
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
  switchDir: PracticeSwitchState;
  triggerSwitch: (dir: PracticeSwitchDir) => void;
  recognitionAvailable: boolean;
  typingAvailable: boolean;
  listeningAvailable: boolean;
};

export function PracticeContent({
  mode,
  loading,
  items,
  index,
  setIndex,
  isFlipped,
  setIsFlipped,
  switchDir,
  triggerSwitch,
  recognitionAvailable,
  typingAvailable,
  listeningAvailable,
}: Props) {
  if (loading) {
    return (
      <div className={style.content}>
        <div className={style.muted}>Loading…</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={style.content}>
        <div className={style.muted}>No cards in this set</div>
      </div>
    );
  }

  let content: ReactNode = null;

  switch (mode) {
    case 'standard':
      content = (
        <StandardPractice
          items={items}
          index={index}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
          setIndex={setIndex}
          switchDir={switchDir}
          triggerSwitch={triggerSwitch}
        />
      );
      break;

    case 'recognition':
      content = !recognitionAvailable ? (
        <div className={style.muted}>Recognition needs at least 2 cards with translation.</div>
      ) : (
        <RecognitionPractice
          switchDir={switchDir}
          onAutoNext={() => triggerSwitch('next')}
          autoNextCommitDelayMs={130}
        />
      );
      break;

    case 'typing':
      content = !typingAvailable ? (
        <div className={style.muted}>Typing needs at least 1 card with translation.</div>
      ) : (
        <TypingPractice
          switchDir={switchDir}
          onAutoNext={() => triggerSwitch('next')}
          autoNextCommitDelayMs={130}
        />
      );
      break;

    case 'context':
      content = (
        <ContextPractice
          switchDir={switchDir}
          onAutoNext={() => triggerSwitch('next')}
          autoNextCommitDelayMs={130}
        />
      );
      break;

    case 'listening':
      content = !listeningAvailable ? (
        <div className={style.muted}>Listening needs at least 1 card with audio.</div>
      ) : (
        <ListeningPractice
          switchDir={switchDir}
          onAutoNext={() => triggerSwitch('next')}
          autoNextCommitDelayMs={130}
        />
      );
      break;

    default:
      content = null;
  }

  return <div className={style.content}>{content}</div>;
}
