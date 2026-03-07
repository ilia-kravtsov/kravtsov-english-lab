import { useNavigate, useParams } from 'react-router-dom';

import { useCardSetPracticePage } from '@/features/vocabulary/card-practice/model/useCardSetPracticePage';
import { usePracticeModeActions } from '@/features/vocabulary/card-practice/model/usePracticeModeActions';
import { usePracticeModeAvailability } from '@/features/vocabulary/card-practice/model/usePracticeModeAvailability';
import { useSwitchAnimation } from '@/features/vocabulary/card-practice/shared/model/useSwitchAnimation';
import { PracticeContent } from '@/pages/vocabulary/ui/internal-components/CardSetPracticePage/PracticeContent/PracticeContent';
import { PracticeModeSidebar } from '@/pages/vocabulary/ui/internal-components/CardSetPracticePage/PracticeModeSidebar/PracticeModeSidebar';
import { CardSetsPageHeader } from '@/pages/vocabulary/ui/internal-components/CardSetsPage/CardSetsPageHeader/CardSetsPageHeader';

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

  const buttonStyles = {
    width: '90px',
    height: '40px',
    fontSize: '16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <div className={style.container}>
      <CardSetsPageHeader
        title={cardSet?.title ?? 'Practice'}
        onBackClick={onBackClick}
        backButtonStyle={buttonStyles}
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
