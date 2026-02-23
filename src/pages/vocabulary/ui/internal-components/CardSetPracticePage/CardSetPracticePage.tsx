import { useNavigate, useParams } from 'react-router-dom';
import type { MouseEvent } from 'react';
import style from './CardSetPracticePage.module.scss';
import { Button } from '@/shared/ui';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { CardSet } from '@/entities/card-set/model/card-set.types.ts';
import type { CardWithLexicalUnit } from '@/entities/card/model/card.types.ts';
import { getCardSetById } from '@/entities/card-set/api/card-set.api.ts';
import { listCardsWithLexicalUnit } from '@/entities/card/api/card.api.ts';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function toAbsoluteMediaUrl(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${apiBaseUrl}${url}`;
}

type Mode = 'standard' | 'typing' | 'listening';

export function CardSetPracticePage() {
  const { cardSetId } = useParams<{ cardSetId: string }>();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('standard');
  const [cardSet, setCardSet] = useState<CardSet | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CardWithLexicalUnit[]>([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!cardSetId) return;

    setLoading(true);
    void (async () => {
      try {
        const [setData, cardsData] = await Promise.all([
          getCardSetById(cardSetId),
          listCardsWithLexicalUnit(cardSetId),
        ]);

        setCardSet(setData);
        setItems(shuffle(cardsData));
        setIndex(0);
        setIsFlipped(false);
      } finally {
        setLoading(false);
      }
    })();
  }, [cardSetId]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== 'Space') return;
      e.preventDefault();
      setIsFlipped(v => !v);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const current = items[index] ?? null;
  const unit = current?.lexicalUnit ?? null;

  const audioSrc = useMemo(() => {
    const url = unit?.audioUrl;
    if (!url) return null;
    return toAbsoluteMediaUrl(url);
  }, [unit]);

  const hasBackContent = Boolean(unit?.translation || unit?.synonyms || unit?.meaning);

  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    void audioRef.current.play();
  };

  const next = () => {
    setIndex(i => {
      const n = i + 1;
      return n >= items.length ? i : n;
    });
    setIsFlipped(false);
  };

  const prev = () => {
    setIndex(i => {
      const n = i - 1;
      return n < 0 ? 0 : n;
    });
    setIsFlipped(false);
  };

  const playHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    playAudio();
  }

  return (
    <div className={style.container}>
      <div className={style.headerRow}>
        <Button
          title={'Back'}
          onClick={() => navigate(`/vocabulary/cards/${cardSetId}`)}
          style={{ width: '100px' }}
        />
        <h2 className={style.title}>{cardSet?.title ?? 'Practice'}</h2>
      </div>

      <div className={style.body}>
        <div className={style.left}>
          <h3 className={style.sectionTitle}>Mode</h3>

          <div className={style.modeList}>
            <button
              type={'button'}
              className={mode === 'standard' ? style.modeBtnActive : style.modeBtn}
              onClick={() => setMode('standard')}
            >
              Standard
            </button>

            <button type={'button'} className={style.modeBtnDisabled} disabled>
              Typing
            </button>

            <button type={'button'} className={style.modeBtnDisabled} disabled>
              Listening
            </button>
          </div>
        </div>

        <div className={style.content}>
          {loading && <div className={style.muted}>Loading…</div>}

          {!loading && items.length === 0 && (
            <div className={style.muted}>No cards in this set</div>
          )}

          {!loading && items.length > 0 && mode === 'standard' && (
            <>
              <div
                className={isFlipped ? style.flipCardFlipped : style.flipCard}
                role={'button'}
                tabIndex={0}
                onClick={() => setIsFlipped(v => !v)}
                onKeyDown={e => {
                  if (e.key === 'Enter') setIsFlipped(v => !v);
                }}
              >
                <div className={style.flipInner}>
                  <div className={style.cardFaceFront}>
                    <div className={style.frontTop}>
                      <div className={style.value}>{unit?.value ?? current?.lexicalUnitId}</div>
                    </div>

                    <div className={style.frontBottom}>
                      {audioSrc && (
                        <>
                          <audio ref={audioRef} src={audioSrc} preload={'metadata'} style={{ display: 'none' }} />
                          <Button
                            type={'button'}
                            onClick={playHandler}
                            title={"Play"}
                            style={{ width: '120px'}}
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

                      {unit?.synonyms && (
                        <div className={style.backRow}>
                          <div className={style.backValue}>{unit.synonyms}</div>
                        </div>
                      )}

                      {unit?.meaning && (
                        <div className={style.backRow}>
                          <div className={style.backValue}>{unit.meaning}</div>
                        </div>
                      )}

                      {unit?.examples && (
                        <div className={style.backRow}>
                          <div className={style.backValue}>{unit.examples}</div>
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
                  style={{ width: '120px' }}
                />
                <div className={style.counter}>
                  {index + 1} / {items.length}
                </div>
                <Button
                  type={'button'}
                  title={'Next'}
                  onClick={next}
                  disabled={index >= items.length - 1}
                  style={{ width: '120px' }}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}