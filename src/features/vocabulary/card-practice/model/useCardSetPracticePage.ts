import { useEffect, useState } from 'react';

import { listCardsWithLexicalUnit } from '@/entities/card/api/card.api';
import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import { getCardSetById } from '@/entities/card-set/api/card-set.api';
import type { CardSet } from '@/entities/card-set/model/card-set.types';
import { useContextStore } from '@/features/vocabulary/card-practice/context/model/context.store';
import { useListeningStore } from '@/features/vocabulary/card-practice/listening/model/listening.store';
import type { PracticeMode } from '@/features/vocabulary/card-practice/model/practice-mode.types';
import { useRecognitionStore } from '@/features/vocabulary/card-practice/recognition/model/recognition.store';
import { shuffle } from '@/features/vocabulary/card-practice/shared/model/shuffle';
import { useTypingStore } from '@/features/vocabulary/card-practice/typing/model/typing.store';

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

  const stopRecognition = useRecognitionStore((s) => s.stop);
  const stopTyping = useTypingStore((s) => s.stop);
  const stopContext = useContextStore((s) => s.stop);
  const stopListening = useListeningStore((s) => s.stop);

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
