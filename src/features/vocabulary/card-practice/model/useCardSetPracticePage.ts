import { useEffect, useState } from 'react';
import type { CardSet } from '@/entities/card-set/model/card-set.types.ts';
import type { CardWithLexicalUnit } from '@/entities/card/model/card.types.ts';
import { getCardSetById } from '@/entities/card-set/api/card-set.api.ts';
import { listCardsWithLexicalUnit } from '@/entities/card/api/card.api.ts';
import { useRecognitionStore } from '@/features/vocabulary/card-practice/recognition/model/recognition.store.ts';
import { useTypingStore } from '@/features/vocabulary/card-practice/typing/model/typing.store.ts';
import { useContextStore } from '@/features/vocabulary/card-practice/context/model/context.store.ts';
import { useListeningStore } from '@/features/vocabulary/card-practice/listening/model/listening.store.ts';
import { shuffle } from '@/features/vocabulary/card-practice/shared/model/shuffle.ts';
import type { PracticeMode } from '@/features/vocabulary/card-practice/model/practice-mode.types.ts';

type Params = {
  cardSetId?: string;
};

export function useCardSetPracticePage({ cardSetId }: Params) {
  const [mode, setMode] = useState<PracticeMode>('standard');
  const [cardSet, setCardSet] = useState<CardSet | null>(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<CardWithLexicalUnit[]>([]);
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const stopRecognition = useRecognitionStore(s => s.stop);
  const stopTyping = useTypingStore(s => s.stop);
  const stopContext = useContextStore(s => s.stop);
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

        stopRecognition();
        stopTyping();
        stopContext();
        stopListening();
        setMode('standard');
      } finally {
        setLoading(false);
      }
    })();
  }, [cardSetId]);

  return {
    mode,
    setMode,
    cardSet,
    loading,
    items,
    setItems,
    index,
    setIndex,
    isFlipped,
    setIsFlipped,
  };
}