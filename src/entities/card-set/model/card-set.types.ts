export interface CardSet {
  id: string;
  key: string;
  title: string;
  description: string | null;
  isPreset: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  cardsCount: number;
}

export interface CreateCardSetPayload {
  title: string;
  description?: string;
  sortOrder?: number;
}

export interface UpdateCardSetPayload {
  title?: string;
  description?: string;
  sortOrder?: number;
}
