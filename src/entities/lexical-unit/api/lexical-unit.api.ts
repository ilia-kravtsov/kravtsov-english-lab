import { api } from '@/shared/api';
import type { AddLexicalUnitFormValues, LexicalUnit, LexicalUnitSuggestion } from '../model/lexical-unit.types';

const blobFileNames: Partial<Record<keyof AddLexicalUnitFormValues, string>> = {
  audio: 'record.webm',
  soundMeaning: 'meaning.webm',
  soundExample: 'example.webm',
};

function toFormData(data: AddLexicalUnitFormValues) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value == null) return;
    if (typeof value === 'string' && value.trim() === '') return;

    const fileName = blobFileNames[key as keyof AddLexicalUnitFormValues];

    if (fileName) {
      formData.append(key, value as Blob, fileName);
      return;
    }

    if (Array.isArray(value)) {
      value.forEach(v => {
        if (v != null && String(v).trim() !== '') {
          formData.append(key, String(v));
        }
      });

      return;
    }

    if (typeof value === 'string' && value.trim() === '') return;

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

export async function suggestLexicalUnits(query: string, limit = 3) {
  const response = await api.get<LexicalUnitSuggestion[]>('/lexical-units/suggest', {
    params: { query, limit },
  });

  return response.data;
}