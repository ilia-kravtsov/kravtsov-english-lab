import { useEffect, useMemo, useRef } from 'react';

import type { PracticeSwitchState } from '@/features/vocabulary/card-practice/model/practice-mode.types.ts';
import { useAutoNextOnCorrect } from '@/features/vocabulary/card-practice/shared/model/useAutoNextOnCorrect.ts';
import { PracticeResults } from '@/features/vocabulary/card-practice/shared/ui/PracticeResults/PracticeResults.tsx';
import switchAnim from '@/features/vocabulary/card-practice/shared/ui/SwitchAnimation.module.scss';
import { Button, Input } from '@/shared/ui';

import { useListeningStore } from '../model/listening.store';
import { toAbsoluteMediaUrl } from '../model/listening.utils.ts';
import style from './ListeningPractice.module.scss';

type Props = {
  switchDir?: PracticeSwitchState;
  onAutoNext?: () => void;
  autoNextCommitDelayMs?: number;
};

export function ListeningPractice({ switchDir, onAutoNext, autoNextCommitDelayMs }: Props) {
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

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!locked) {
      inputRef.current?.focus();
    }
  }, [index, locked]);

  useAutoNextOnCorrect({
    isFinished,
    locked,
    feedback,
    next,
    delayMs: 450,
    beforeNext: onAutoNext,
    commitDelayMs: autoNextCommitDelayMs ?? 130,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = cards[index] ?? null;
  const unit = current?.lexicalUnit ?? null;

  const audioSrc = useMemo(() => {
    const url = unit?.audioUrl;
    if (!url) return null;
    return toAbsoluteMediaUrl(url);
  }, [unit?.audioUrl]);

  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    void audioRef.current.play();
  };

  if (!cardSetId) return null;

  if (isFinished) {
    return (
      <PracticeResults cardSetId={cardSetId} restart={restart} restartTitle={'Restart Listening'} />
    );
  }

  if (!current || !unit) return null;

  return (
    <div className={style.wrap}>
      <div
        className={[
          style.card,
          switchDir === 'next' ? switchAnim.switchNext : '',
          switchDir === 'prev' ? switchAnim.switchPrev : '',
          feedback === 'correct' ? style.cardCorrect : '',
          feedback === 'wrong' ? style.cardWrong : '',
        ].join(' ')}
      >
        <div className={style.promptLabel}>Listen and type:</div>
        <div className={style.audioRow}>
          {audioSrc && (
            <audio ref={audioRef} src={audioSrc} preload={'metadata'} style={{ display: 'none' }} />
          )}
          <Button
            type={'button'}
            title={'Play'}
            onClick={playAudio}
            disabled={!audioSrc}
            style={{ width: '140px' }}
          />
        </div>
        <div className={style.hint}>
          <div className={style.hintLabel}>Hint</div>
          <div className={style.hintValue}>{unit?.translation ?? '—'}</div>
        </div>
      </div>

      <div className={style.formRow}>
        <Input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'Type lexical unit'}
          disabled={locked}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
        />
        <div className={style.buttonsContainer}>
          <Button title={'Check'} onClick={submit} disabled={locked} style={{ width: '120px' }} />
          <Button title={'Skip'} onClick={skip} style={{ width: '120px' }} />
        </div>
      </div>

      <div className={style.controlsRow}>
        <div className={style.counter}>
          {index + 1} / {cards.length}
        </div>
        <div className={style.meta}>Attempts: {attempts}</div>
      </div>
    </div>
  );
}
