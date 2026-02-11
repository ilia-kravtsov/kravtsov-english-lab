import { api } from '@/shared/api';
import type { AddLexicalUnitFormValues, LexicalUnit } from '../model/lexical-unit.types';

function toFormData(data: AddLexicalUnitFormValues) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value == null) return;

    if (key === 'audio') {
      formData.append('audio', value as Blob, 'record.webm');
      return;
    }

    formData.append(key, String(value));
  });

  return formData;
}

export async function addLexicalUnit(data: AddLexicalUnitFormValues) {
  const response = await api.post<LexicalUnit>('/lexical-units', toFormData(data), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export async function updateLexicalUnit(id: string, data: AddLexicalUnitFormValues) {
  const response = await api.put<LexicalUnit>(`/lexical-units/${id}`, toFormData(data), {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}

export async function deleteLexicalUnit(id: string) {
  await api.delete(`/lexical-units/${id}`);
}

export async function searchLexicalUnitByValue(value: string) {
  const response = await api.get<LexicalUnit | null>('/lexical-units/search', {
    params: { value },
  });

  return response.data;
}
