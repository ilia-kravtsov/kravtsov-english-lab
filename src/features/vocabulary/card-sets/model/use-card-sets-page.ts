import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { createCard, deleteCard, listCardsWithLexicalUnit } from '@/entities/card/api/card.api';
import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';
import { getCardSetById } from '@/entities/card-set/api/card-set.api';
import type { CardSet } from '@/entities/card-set/model/card-set.types';
import { useLexicalUnitSearchQuery } from '@/features/vocabulary/lexical-unit-add/model/use-lexical-unit-search-query.ts';

export function useCardSetsPage(cardSetId: string | undefined) {
  const lexicalSearch = useLexicalUnitSearchQuery();

  const [cards, setCards] = useState<CardWithLexicalUnit[]>([]);
  const [cardsLoading, setCardsLoading] = useState(false);

  const [cardSet, setCardSet] = useState<CardSet | null>(null);
  const [cardSetLoading, setCardSetLoading] = useState(false);

  const [adding, setAdding] = useState(false);

  const [removeTarget, setRemoveTarget] = useState<CardWithLexicalUnit | null>(null);
  const [removing, setRemoving] = useState(false);

  const loadCards = async () => {
    if (!cardSetId) return;

    setCardsLoading(true);
    try {
      const data = await listCardsWithLexicalUnit(cardSetId);
      setCards(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load cards');
    } finally {
      setCardsLoading(false);
    }
  };

  const loadCardSet = async () => {
    if (!cardSetId) return;

    setCardSetLoading(true);
    try {
      const data = await getCardSetById(cardSetId);
      setCardSet(data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load card set');
    } finally {
      setCardSetLoading(false);
    }
  };

  useEffect(() => {
    void loadCardSet();
    void loadCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardSetId]);

  const foundUnitId = useMemo(() => {
    return lexicalSearch.result.status === 'found' ? lexicalSearch.result.unit.id : null;
  }, [lexicalSearch.result]);

  const inSet = useMemo(() => {
    if (!foundUnitId) return false;
    return cards.some((c) => c.lexicalUnitId === foundUnitId);
  }, [cards, foundUnitId]);

  const foundCardInSet = useMemo(() => {
    if (!foundUnitId) return null;
    return cards.find((c) => c.lexicalUnitId === foundUnitId) ?? null;
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

  const requestRemove = (card: CardWithLexicalUnit) => {
    setRemoveTarget(card);
  };

  const cancelRemove = () => {
    setRemoveTarget(null);
  };

  const confirmRemove = async () => {
    if (!cardSetId) return;
    if (!removeTarget) return;
    if (removing) return;

    setRemoving(true);
    try {
      await deleteCard(cardSetId, removeTarget.id);
      toast.success('Removed from set');
      setRemoveTarget(null);
      await loadCards();
    } catch (e) {
      console.error(e);
      toast.error('Failed to remove');
    } finally {
      setRemoving(false);
    }
  };

  return {
    cardSet,
    cardSetLoading,

    lexicalSearch,
    cards,
    cardsLoading,
    reloadCards: loadCards,

    inSet,
    foundCardInSet,
    adding,
    addToSet,

    removeTarget,
    removing,
    requestRemove,
    cancelRemove,
    confirmRemove,
  };
}
