import { useListeningAudio } from '@/features/vocabulary/card-practice/listening/model/useListeningAudio';
import { getPracticeCardClassName } from '@/features/vocabulary/card-practice/shared/lib/getPracticeCardStyles';
import type { PracticeViewProps } from '@/features/vocabulary/card-practice/shared/model/practice-view.types';
import { usePracticeView } from '@/features/vocabulary/card-practice/shared/model/usePracticeView';
import { useTextInputPracticeHandlers } from '@/features/vocabulary/card-practice/shared/model/useTextInputPracticeHandlers';
import { PracticeGuard } from '@/features/vocabulary/card-practice/shared/ui/PracticeGuard';
import { PracticeProgress } from '@/features/vocabulary/card-practice/shared/ui/PracticeProgress';
import switchAnim from '@/features/vocabulary/card-practice/shared/ui/SwitchAnimation.module.scss';
import { Button, Input } from '@/shared/ui';
import { normalButtonWide, wideButtonStyles } from '@/shared/ui/ButtonStyles/button.styles';

import { useListeningStore } from '../model/listening.store';
import style from './ListeningPractice.module.scss';

export function ListeningPractice({
  switchDir,
  onAutoNext,
  autoNextCommitDelayMs,
}: PracticeViewProps) {
  const cards = useListeningStore((s) => s.cards);
  const index = useListeningStore((s) => s.index);
  const feedback = useListeningStore((s) => s.feedback);
  const locked = useListeningStore((s) => s.locked);

  const input = useListeningStore((s) => s.input);
  const setInput = useListeningStore((s) => s.setInput);

  const attempts = useListeningStore((s) => s.attempts);

  const isFinished = useListeningStore((s) => s.isFinished);
  const cardSetId = useListeningStore((s) => s.cardSetId);

  const submit = useListeningStore((s) => s.submit);
  const skip = useListeningStore((s) => s.skip);
  const next = useListeningStore((s) => s.next);
  const restart = useListeningStore((s) => s.restart);

  const { inputRef, current } = usePracticeView({
    cards,
    index,
    locked,
    isFinished,
    feedback,
    next,
    onAutoNext,
    autoNextCommitDelayMs,
    withInputFocus: true,
  });

  const { handleInputChange, handleInputKeyDown } = useTextInputPracticeHandlers({
    style,
    switchDir,
    feedback,
    setInput,
    submit,
  });

  const unit = current?.lexicalUnit ?? null;

  const { audioRef, audioSrc, playAudio } = useListeningAudio({
    cardId: current?.id,
    audioUrl: unit?.audioUrl,
  });

  const cardStyles = getPracticeCardClassName(style, switchAnim, switchDir, feedback);

  return (
    <PracticeGuard
      cardSetId={cardSetId}
      isFinished={isFinished}
      restart={restart}
      restartTitle={'Restart Listening'}
      isReady={Boolean(current && unit)}
    >
      <div className={style.wrap}>
        <div className={cardStyles}>
          <div className={style.promptLabel}>Listen and type:</div>
          <div className={style.audioRow}>
            {audioSrc && (
              <audio
                ref={audioRef}
                src={audioSrc}
                preload={'metadata'}
                style={{ display: 'none' }}
              />
            )}
            <Button
              type={'button'}
              title={'Play'}
              onClick={playAudio}
              disabled={!audioSrc}
              style={wideButtonStyles}
            />
          </div>
          <div className={style.hint}>
            <div className={style.hintLabel}>Hint</div>
            <div className={style.hintValue}>{unit?.translation}</div>
          </div>
        </div>

        <div className={style.formRow}>
          <Input
            ref={inputRef}
            value={input}
            onChange={handleInputChange}
            placeholder={'Type lexical unit'}
            disabled={locked}
            onKeyDown={handleInputKeyDown}
          />
          <div className={style.buttonsContainer}>
            <Button title={'Check'} onClick={submit} disabled={locked} style={normalButtonWide} />
            <Button title={'Skip'} onClick={skip} style={normalButtonWide} />
          </div>
        </div>

        <PracticeProgress index={index} total={cards.length} attempts={attempts} style={style} />
      </div>
    </PracticeGuard>
  );
}
