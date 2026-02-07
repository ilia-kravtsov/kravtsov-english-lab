import { api } from '@/shared/api';
import type { AddLexicalUnitFormValues } from '../model/lexical-unit.types';

export async function addLexicalUnit(data: AddLexicalUnitFormValues) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value == null) return;

    if (key === 'audio') {
      formData.append('audio', value as Blob, 'record.webm');
    } else {
      formData.append(key, String(value));
    }
  });

  const response = await api.post('/lexical-units', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data;
}
