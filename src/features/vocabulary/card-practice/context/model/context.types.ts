import type { TextInputSessionCard } from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types.ts';

export type ContextSessionCard = TextInputSessionCard & {
  contextExample: string;
  contextMasked: string;
};