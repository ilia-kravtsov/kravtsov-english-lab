export interface Card {
  id: string;
  cardSetId: string;
  lexicalUnitId: string;
  note: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCardPayload {
  lexicalUnitId: string;
  note?: string;
  sortOrder?: number;
}

export interface UpdateCardPayload {
  note?: string | null;
  sortOrder?: number;
}