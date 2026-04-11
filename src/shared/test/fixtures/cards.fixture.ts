import type { CardWithLexicalUnit } from '@/entities/card';
import type { LexicalUnitType } from '@/entities/lexical-unit';

const WORD_TYPE = 'word' as LexicalUnitType;

export const baseCards: CardWithLexicalUnit[] = [
  {
    id: 'card-1',
    cardSetId: 'set-1',
    lexicalUnitId: 'lu-1',
    note: null,
    sortOrder: 0,
    createdAt: '2026-04-08T00:00:00.000Z',
    updatedAt: '2026-04-08T00:00:00.000Z',
    lexicalUnit: {
      id: 'lu-1',
      type: WORD_TYPE,
      value: 'hello',
      translation: 'привет',
      meaning: 'a greeting',
    },
  },
  {
    id: 'card-2',
    cardSetId: 'set-1',
    lexicalUnitId: 'lu-2',
    note: null,
    sortOrder: 1,
    createdAt: '2026-04-08T00:00:00.000Z',
    updatedAt: '2026-04-08T00:00:00.000Z',
    lexicalUnit: {
      id: 'lu-2',
      type: WORD_TYPE,
      value: 'world',
      translation: 'мир',
      meaning: 'the earth and all people',
    },
  },
  {
    id: 'card-3',
    cardSetId: 'set-1',
    lexicalUnitId: 'lu-3',
    note: null,
    sortOrder: 2,
    createdAt: '2026-04-08T00:00:00.000Z',
    updatedAt: '2026-04-08T00:00:00.000Z',
    lexicalUnit: {
      id: 'lu-3',
      type: WORD_TYPE,
      value: 'cat',
      translation: 'кот',
      meaning: 'an animal',
    },
  },
  {
    id: 'card-4',
    cardSetId: 'set-1',
    lexicalUnitId: 'lu-4',
    note: null,
    sortOrder: 3,
    createdAt: '2026-04-08T00:00:00.000Z',
    updatedAt: '2026-04-08T00:00:00.000Z',
    lexicalUnit: {
      id: 'lu-4',
      type: WORD_TYPE,
      value: 'sun',
      translation: 'солнце',
      meaning: 'a star',
    },
  },
];

export const typingCards = baseCards.slice(0, 2);

export const recognitionCards = baseCards;

export const contextCards: CardWithLexicalUnit[] = [
  {
    ...baseCards[0],
    lexicalUnit: {
      ...baseCards[0].lexicalUnit!,
      examples: ['I say hello to my friend every day.'],
    },
  },
  {
    ...baseCards[1],
    lexicalUnit: {
      ...baseCards[1].lexicalUnit!,
      examples: ['The world is changing very quickly.'],
    },
  },
];

export const listeningCards: CardWithLexicalUnit[] = [
  {
    ...baseCards[0],
    lexicalUnit: {
      ...baseCards[0].lexicalUnit!,
      audioUrl: 'https://example.com/audio/hello.mp3',
    },
  },
  {
    ...baseCards[1],
    lexicalUnit: {
      ...baseCards[1].lexicalUnit!,
      audioUrl: 'https://example.com/audio/world.mp3',
    },
  },
];