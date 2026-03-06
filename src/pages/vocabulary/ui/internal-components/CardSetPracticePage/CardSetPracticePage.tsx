import { useNavigate, useParams } from 'react-router-dom';
import style from './CardSetPracticePage.module.scss';
import { Button } from '@/shared/ui';
import { useSwitchAnimation } from '@/features/vocabulary/card-practice/shared/useSwitchAnimation.ts';
import { useCardSetPracticePage } from '@/features/vocabulary/card-practice/model/useCardSetPracticePage.ts';
import { usePracticeModeAvailability } from '@/features/vocabulary/card-practice/model/usePracticeModeAvailability.ts';
import { usePracticeModeActions } from '@/features/vocabulary/card-practice/model/usePracticeModeActions.ts';
import { PracticeModeSidebar } from '@/pages/vocabulary/ui/internal-components/CardSetPracticePage/PracticeModeSidebar/PracticeModeSidebar.tsx';
import { PracticeContent } from '@/pages/vocabulary/ui/internal-components/CardSetPracticePage/PracticeContent/PracticeContent.tsx';

type CardSetId = {
  cardSetId: string;
}

export function CardSetPracticePage() {
  const { cardSetId } = useParams<CardSetId>();
  const navigate = useNavigate();

  const {
    dir: switchDir,
    trigger: triggerSwitch
  } = useSwitchAnimation(260);

  const {
    mode,
    setMode,
    cardSet,
    loading,
    items,
    index,
    setIndex,
    isFlipped,
    setIsFlipped,
  } = useCardSetPracticePage({ cardSetId });

  const {
    recognitionAvailable,
    typingAvailable,
    contextAvailable,
    listeningAvailable,
  } = usePracticeModeAvailability({ items });

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

  const backHandlerClick = () => {
    navigate(`/vocabulary/cards/${cardSetId}`)
  }

  const buttonStyles = {
    width: '100px',
  }

  return (
    <div className={style.container}>
      <div className={style.headerRow}>
        <Button
          title={'Back'}
          onClick={backHandlerClick}
          style={buttonStyles}
        />
        <h2 className={style.title}>{cardSet?.title ?? 'Practice'}</h2>
      </div>

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