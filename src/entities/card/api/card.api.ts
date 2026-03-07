import { api } from '@/shared/api';

import type {
  Card,
  CardWithLexicalUnit,
  CreateCardPayload,
  UpdateCardPayload,
} from '../model/card.types';

export async function listCards(cardSetId: string) {
  const res = await api.get<Card[]>(`/card-sets/${cardSetId}/cards`);
  return res.data;
}

export async function listCardsWithLexicalUnit(cardSetId: string) {
  const res = await api.get<CardWithLexicalUnit[]>(`/card-sets/${cardSetId}/cards`, {
    params: { include: 'lexicalUnit' },
  });
  return res.data;
}

export async function createCard(cardSetId: string, payload: CreateCardPayload) {
  const res = await api.post<Card>(`/card-sets/${cardSetId}/cards`, payload);
  return res.data;
}

export async function deleteCard(cardSetId: string, cardId: string) {
  await api.delete(`/card-sets/${cardSetId}/cards/${cardId}`);
}

export async function updateCard(cardSetId: string, cardId: string, payload: UpdateCardPayload) {
  const res = await api.put<Card>(`/card-sets/${cardSetId}/cards/${cardId}`, payload);
  return res.data;
}
