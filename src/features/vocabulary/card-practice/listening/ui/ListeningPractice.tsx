import { useMemo, useRef } from 'react';
import { Button, Input } from '@/shared/ui';
import style from './ListeningPractice.module.scss';
import { useListeningStore } from '../model/listening.store';
import { toAbsoluteMediaUrl } from '../model/listening.utils.ts';
import { useAutoNextOnCorrect } from '@/features/vocabulary/card-practice/shared/useAutoNextOnCorrect.ts';

export function ListeningPractice() {
  const cards = useListeningStore(s => s.cards);
  const index = useListeningStore(s => s.index);
  const feedback = useListeningStore(s => s.feedback);
  const locked = useListeningStore(s => s.locked);

  const input = useListeningStore(s => s.input);
  const setInput = useListeningStore(s => s.setInput);

  const attempts = useListeningStore(s => s.attempts);

  const isFinished = useListeningStore(s => s.isFinished);
  const cardSetId = useListeningStore(s => s.cardSetId);
  const getStoredListening = useListeningStore(s => s.getStoredListening);

  const submit = useListeningStore(s => s.submit);
  const next = useListeningStore(s => s.next);
  const restart = useListeningStore(s => s.restart);

  useAutoNextOnCorrect({ isFinished, locked, feedback, next, delayMs: 450 });

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
    const l = getStoredListening(cardSetId);
    return (
      <div className={style.result}>
        <h3 className={style.sectionTitle}>Results</h3>

        <div className={style.resultBlock}>
          <div className={style.resultRow}>
            <div className={style.resultLabel}>Listening</div>
            <div className={style.resultValue}>
              {l ? `${l.correctCards}/${l.totalCards} (${l.accuracy}%) · avg ${l.avgTimeMs}ms` : 'Not started'}
            </div>
          </div>

          <div className={style.resultRow}>
            <div className={style.resultLabel}>Recognition</div>
            <div className={style.resultValue}>Not started</div>
          </div>

          <div className={style.resultRow}>
            <div className={style.resultLabel}>Typing</div>
            <div className={style.resultValue}>Not started</div>
          </div>

          <div className={style.resultRow}>
            <div className={style.resultLabel}>Context</div>
            <div className={style.resultValue}>Not started</div>
          </div>
        </div>

        <div className={style.controlsRow}>
          <Button title={'Restart Listening'} onClick={restart} style={{ width: '200px' }} />
        </div>
      </div>
    );
  }

  if (!current || !unit) return null;

  return (
    <div className={style.wrap}>
      <div
        className={[
          style.card,
          feedback === 'correct' ? style.cardCorrect : '',
          feedback === 'wrong' ? style.cardWrong : '',
        ].join(' ')}
      >
        <div className={style.promptLabel}>Listen and type:</div>

        <div className={style.audioRow}>
          {audioSrc && <audio ref={audioRef} src={audioSrc} preload={'metadata'} style={{ display: 'none' }} />}
          <Button
            type={'button'}
            title={'Play'}
            onClick={playAudio}
            disabled={!audioSrc}
            style={{ width: '140px' }}
          />
        </div>

        <div className={style.counter}>
          {index + 1} / {cards.length}
        </div>
      </div>

      <div className={style.formRow}>
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder={'Type lexical unit'}
          disabled={locked}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            }
          }}
        />
        <Button title={'Check'} onClick={submit} disabled={locked} style={{ width: '120px' }} />
      </div>

      <div className={style.controlsRow}>
        <div className={style.meta}>Attempts: {attempts}</div>
      </div>
    </div>
  );
}