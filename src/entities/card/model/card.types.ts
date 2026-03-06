import type { LexicalUnit } from '@/entities/lexical-unit';

export interface Card {
  id: string;
  cardSetId: string;
  lexicalUnitId: string;
  note: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CardWithLexicalUnit extends Card {
  lexicalUnit: LexicalUnit | null;
}

export interface CreateCardPayload {
  lexicalUnitId: string;
  note?: string | null;
  sortOrder?: number;
}

export interface UpdateCardPayload {
  note?: string | null;
  sortOrder?: number;
}
