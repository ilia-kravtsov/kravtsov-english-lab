import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import type { Card } from '@/entities/card/model/card.types';
import { createCard, listCards } from '@/entities/card/api/card.api';
import { useLexicalUnitSearch } from '@/features/vocabulary/lexical-unit-add/model/useLexicalUnitSearch';

export function useCardSetsPage(cardSetId: string | undefined) {
  const lexicalSearch = useLexicalUnitSearch();

  const [cards, setCards] = useState<Card[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const loadCards = async () => {
    if (!cardSetId) return;

    setCardsLoading(true);
    try {
      const data = await listCards(cardSetId);
      setCards(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load cards');
    } finally {
      setCardsLoading(false);
    }
  };

  useEffect(() => {
    void loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardSetId]);

  const foundUnitId = useMemo(() => {
    return lexicalSearch.result.status === 'found'
      ? lexicalSearch.result.unit.id
      : null;
  }, [lexicalSearch.result]);

  const inSet = useMemo(() => {
    if (!foundUnitId) return false;
    return cards.some(c => c.lexicalUnitId === foundUnitId);
  }, [cards, foundUnitId]);

  const addToSet = async () => {
    if (!cardSetId) return;
    if (!foundUnitId) return;
    if (adding) return;
    if (inSet) return;

    setAdding(true);
    try {
      await createCard(cardSetId, { lexicalUnitId: foundUnitId });
      toast.success('Added');
      await loadCards();
    } catch (e) {
      console.error(e);
      toast.error('Failed to add');
    } finally {
      setAdding(false);
    }
  };

  return {
    lexicalSearch,

    cards,
    cardsLoading,
    reloadCards: loadCards,

    inSet,
    adding,
    addToSet,
  };
}