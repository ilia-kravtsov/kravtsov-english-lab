import { useNavigate, useParams } from 'react-router-dom';

import { useCardSetPracticePage } from '@/features/vocabulary/card-practice/model/use-card-set-practice-page.ts';
import { usePracticeModeActions } from '@/features/vocabulary/card-practice/model/use-practice-mode-actions.ts';
import { usePracticeModeAvailability } from '@/features/vocabulary/card-practice/model/use-practice-mode-availability.ts';
import { useSwitchAnimation } from '@/features/vocabulary/card-practice/shared/model/use-switch-animation.ts';
import { PracticeContent } from '@/pages/vocabulary/ui/card-set-practice-page/PracticeContent/PracticeContent.tsx';
import { PracticeModeSidebar } from '@/pages/vocabulary/ui/card-set-practice-page/PracticeModeSidebar/PracticeModeSidebar.tsx';
import { CardSetsPageHeader } from '@/pages/vocabulary/ui/card-sets-page/card-sets-page-header/CardSetsPageHeader.tsx';
import { smallButtonStyles } from '@/shared/lib/styles/button.styles.ts';

import style from './CardSetPracticePage.module.scss';

type CardSetId = {
  cardSetId: string;
};

export function CardSetPracticePage() {
  const { cardSetId } = useParams<CardSetId>();
  const navigate = useNavigate();

  const { dir: switchDir, trigger: triggerSwitch } = useSwitchAnimation(260);

  const { mode, setMode, cardSet, loading, items, index, setIndex, isFlipped, setIsFlipped } =
    useCardSetPracticePage({ cardSetId });

  const { recognitionAvailable, typingAvailable, contextAvailable, listeningAvailable } =
    usePracticeModeAvailability({ items });

  const {
    setStandardMode,
    startRecognitionMode,
    startTypingMode,
    startContextMode,
    startListeningMode,
  } = usePracticeModeActions({
    cardSetId,
    items,
    setMode,
    recognitionAvailable,
    typingAvailable,
    contextAvailable,
    listeningAvailable,
  });

  const onBackClick = () => {
    navigate(`/vocabulary/cards/${cardSetId}`);
  };

  return (
    <div className={style.container}>
      <CardSetsPageHeader
        title={cardSet?.title ?? 'Practice'}
        onBackClick={onBackClick}
        backButtonStyle={smallButtonStyles}
      />

      <div className={style.body}>
        <PracticeModeSidebar
          mode={mode}
          loading={loading}
          hasItems={items.length > 0}
          recognitionAvailable={recognitionAvailable}
          typingAvailable={typingAvailable}
          listeningAvailable={listeningAvailable}
          contextAvailable={contextAvailable}
          onStandardClick={setStandardMode}
          onRecognitionClick={startRecognitionMode}
          onTypingClick={startTypingMode}
          onListeningClick={startListeningMode}
          onContextClick={startContextMode}
        />

        <PracticeContent
          mode={mode}
          loading={loading}
          items={items}
          index={index}
          setIndex={setIndex}
          isFlipped={isFlipped}
          setIsFlipped={setIsFlipped}
          switchDir={switchDir}
          triggerSwitch={triggerSwitch}
          recognitionAvailable={recognitionAvailable}
          typingAvailable={typingAvailable}
          listeningAvailable={listeningAvailable}
        />
      </div>
    </div>
  );
}
