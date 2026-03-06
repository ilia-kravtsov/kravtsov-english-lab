import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import style from './CardSetPracticePage.module.scss';
import { Button } from '@/shared/ui';
import type { CardSet } from '@/entities/card-set/model/card-set.types.ts';
import type { CardWithLexicalUnit } from '@/entities/card/model/card.types.ts';
import { getCardSetById } from '@/entities/card-set/api/card-set.api.ts';
import { listCardsWithLexicalUnit } from '@/entities/card/api/card.api.ts';
import { useRecognitionStore } from '@/features/vocabulary/card-practice/recognition/model/recognition.store.ts';
import { RecognitionPractice } from '@/features/vocabulary/card-practice/recognition/ui/RecognitionPractice.tsx';
import { useTypingStore } from '@/features/vocabulary/card-practice/typing/model/typing.store.ts';
import { TypingPractice } from '@/features/vocabulary/card-practice/typing/ui/TypingPractice.tsx';
import { useContextStore } from '@/features/vocabulary/card-practice/context/model/context.store.ts';
import { pickContextExample } from '@/features/vocabulary/card-practice/context/model/context.utils.ts';
import { ContextPractice } from '@/features/vocabulary/card-practice/context/ui/ContextPractice.tsx';
import { useListeningStore } from '@/features/vocabulary/card-practice/listening/model/listening.store.ts';
import { ListeningPractice } from '@/features/vocabulary/card-practice/listening/ui/ListeningPractice.tsx';
import { useSwitchAnimation } from '@/features/vocabulary/card-practice/shared/useSwitchAnimation.ts';
import { StandardPractice } from '@/features/vocabulary/card-practice/standard/ui/StandardPractice.tsx';

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Mode = 'standard' | 'recognition' | 'typing' | 'listening' | 'context';

export function CardSetPracticePage() {
  const { cardSetId } = useParams<{ cardSetId: string }>();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('standard');
  const [cardSet, setCardSet] = useState<CardSet | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CardWithLexicalUnit[]>([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const { dir: switchDir, trigger: triggerSwitch } = useSwitchAnimation(260);

  const startRecognition = useRecognitionStore(s => s.start);
  const stopRecognition = useRecognitionStore(s => s.stop);
  const startTyping = useTypingStore(s => s.start);
  const stopTyping = useTypingStore(s => s.stop);
  const startContext = useContextStore(s => s.start);
  const stopContext = useContextStore(s => s.stop);
  const startListening = useListeningStore(s => s.start);
  const stopListening = useListeningStore(s => s.stop);

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

        stopRecognition()
        stopTyping()
        stopContext();
        stopListening()
        setMode('standard');
      } finally {
        setLoading(false);
      }
    })();
  }, [cardSetId]);

  const recognitionAvailable = useMemo(() => {
    const count = items.filter(
      c => c.lexicalUnit && (c.lexicalUnit.translation ?? '').trim().length > 0
    ).length;
    return count >= 2;
  }, [items]);

  const typingAvailable = useMemo(() => {
    const count = items.filter(
      c => c.lexicalUnit && (c.lexicalUnit.translation ?? '').trim().length > 0
    ).length;
    return count >= 1;
  }, [items]);

  const contextAvailable = useMemo(() => {
    const count = items.filter(c => {
      const lu = c.lexicalUnit;
      if (!lu) return false;
      const ex = lu.examples ?? [];
      if (!ex.length) return false;
      return Boolean(pickContextExample(lu.value ?? '', ex));
    }).length;
    return count >= 1;
  }, [items]);

  const listeningAvailable = useMemo(() => {
    const count = items.filter(c => c.lexicalUnit && Boolean(c.lexicalUnit.audioUrl)).length;
    return count >= 1;
  }, [items]);

  const startRecognitionHandler = () => {
    if (!cardSetId) return;
    if (!recognitionAvailable) return;
    stopTyping();
    stopContext();
    stopListening();
    startRecognition(cardSetId, items);
    setMode('recognition');
  };

  const startTypingHandler = () => {
    if (!cardSetId) return;
    if (!typingAvailable) return;
    stopRecognition();
    stopContext();
    stopListening();
    startTyping(cardSetId, items);
    setMode('typing');
  };

  const startContextHandler = () => {
    if (!cardSetId) return;
    if (!contextAvailable) return;
    stopRecognition();
    stopTyping();
    stopListening();
    startContext(cardSetId, items);
    setMode('context');
  };

  const startListeningHandler = () => {
    if (!cardSetId) return;
    if (!listeningAvailable) return;
    stopRecognition();
    stopTyping();
    stopContext();
    startListening(cardSetId, items);
    setMode('listening');
  };

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
              onClick={() => {
                stopRecognition();
                stopTyping();
                stopContext();
                setMode('standard');
              }}
            >
              Standard
            </button>

            <button
              type={'button'}
              className={mode === 'recognition' ? style.modeBtnActive : style.modeBtn}
              onClick={startRecognitionHandler}
              disabled={!recognitionAvailable || loading || items.length === 0}
            >
              Recognition
            </button>

            <button
              type={'button'}
              className={mode === 'typing' ? style.modeBtnActive : style.modeBtn}
              onClick={startTypingHandler}
              disabled={!typingAvailable || loading || items.length === 0}
            >
              Typing
            </button>

            <button
              type={'button'}
              className={mode === 'listening' ? style.modeBtnActive : style.modeBtn}
              onClick={startListeningHandler}
              disabled={!listeningAvailable || loading || items.length === 0}
            >
              Listening
            </button>

            <button
              type={'button'}
              className={mode === 'context' ? style.modeBtnActive : style.modeBtn}
              onClick={startContextHandler}
              disabled={!contextAvailable || loading || items.length === 0}
            >
              Context
            </button>
          </div>

          {!loading && items.length > 0 && !recognitionAvailable && (
            <div className={style.modeHint}>Recognition needs at least 2 cards with translation.</div>
          )}

          {!loading && items.length > 0 && !contextAvailable && (
            <div className={style.modeHint}>Context needs at least 1 card with example containing lexical unit.</div>
          )}
        </div>

        <div className={style.content}>
          {loading && <div className={style.muted}>Loading…</div>}

          {!loading && items.length === 0 && (
            <div className={style.muted}>No cards in this set</div>
          )}

          {!loading && items.length > 0 && mode === 'standard' && (
            <StandardPractice
              items={items}
              index={index}
              isFlipped={isFlipped}
              setIsFlipped={setIsFlipped}
              setIndex={setIndex}
              switchDir={switchDir}
              triggerSwitch={triggerSwitch}
            />
          )}

          {!loading && items.length > 0 && mode === 'recognition' && (
            <>
              {!recognitionAvailable && (
                <div className={style.muted}>Recognition needs at least 2 cards with translation.</div>
              )}
              {recognitionAvailable && (
                <RecognitionPractice
                  switchDir={switchDir}
                  onAutoNext={() => triggerSwitch('next')}
                  autoNextCommitDelayMs={130}
                />
              )}
            </>
          )}

          {!loading && items.length > 0 && mode === 'typing' && (
            <>
              {!typingAvailable && <div className={style.muted}>Typing needs at least 1 card with translation.</div>}
              {typingAvailable && (
                <TypingPractice
                  switchDir={switchDir}
                  onAutoNext={() => triggerSwitch('next')}
                  autoNextCommitDelayMs={130}
                />
              )}
            </>
          )}

          {!loading && items.length > 0 && mode === 'context' && (
            <ContextPractice
              switchDir={switchDir}
              onAutoNext={() => triggerSwitch('next')}
              autoNextCommitDelayMs={130}
            />
          )}

          {!loading && items.length > 0 && mode === 'listening' && (
            <>
              {!listeningAvailable && <div className={style.muted}>Listening needs at least 1 card with audio.</div>}
              {listeningAvailable && (
                <ListeningPractice
                  switchDir={switchDir}
                  onAutoNext={() => triggerSwitch('next')}
                  autoNextCommitDelayMs={130}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}