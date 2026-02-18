import { api } from '@/shared/api';
import type { CardSet, CreateCardSetPayload, UpdateCardSetPayload } from '../model/card-set.types.ts';

export async function getCardSets() {
  const res = await api.get<CardSet[]>('/card-sets');
  return res.data;
}

export async function getCardSet(id: string) {
  const res = await api.get<CardSet>(`/card-sets/${id}`);
  return res.data;
}

export async function createCardSet(payload: CreateCardSetPayload) {
  const res = await api.post<CardSet>('/card-sets', payload);
  return res.data;
}

export async function updateCardSet(id: string, payload: UpdateCardSetPayload) {
  const res = await api.put<CardSet>(`/card-sets/${id}`, payload);
  return res.data;
}

export async function deleteCardSet(id: string) {
  await api.delete(`/card-sets/${id}`);
}
