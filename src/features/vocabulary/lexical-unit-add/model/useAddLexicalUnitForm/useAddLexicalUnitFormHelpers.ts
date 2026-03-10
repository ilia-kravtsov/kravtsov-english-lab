import { type RefObject, useEffect, useState } from 'react';

import type {
  AddLexicalUnitFormValues,
  LexicalUnit,
  PartsOfSpeech,
} from '@/entities/lexical-unit/model/lexical-unit.types.ts';

export type ArrayFieldName = 'examples' | 'synonyms' | 'antonyms';

export type AudioFieldModel = {
  recording: boolean;
  audioBlob: Blob | null;
  audioUrl: string | null;
  remoteAudioSrc: string | null;
  audioRef: RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  elapsedSec: number;
  maxSec: number;
  startRecording: () => void;
  stopRecording: () => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
};

export const MAX_ITEMS = 5;

function normalizeValue(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function computeTypeByValue(value: string): AddLexicalUnitFormValues['type'] {
  const v = normalizeValue(value);
  return v.includes(' ') ? 'expression' : 'word';
}

function ensureAtLeastOne(v?: string[] | null) {
  if (!v || v.length === 0) {
    return [''];
  }

  return v;
}

function trimNonEmpty(v?: string[] | null) {
  const list = (v ?? []).map((s) => s.trim()).filter(Boolean);
  return list.length ? list : undefined;
}

export function getEmptyFormValues() {
  return {
    value: '',
    translation: '',
    transcription: '',
    meaning: '',
    partsOfSpeech: undefined,
    synonyms: [''],
    antonyms: [''],
    examples: [''],
    comment: '',
    audio: null,
    soundMeaning: null,
    soundExample: null,
    imageUrl: '',
  };
}

export function createEditFormValues(editingUnit: LexicalUnit) {
  return {
    value: editingUnit.value ?? '',
    translation: editingUnit.translation ?? '',
    transcription: editingUnit.transcription ?? '',
    meaning: editingUnit.meaning ?? '',
    partsOfSpeech: editingUnit.partsOfSpeech ?? [],
    synonyms: ensureAtLeastOne(editingUnit.synonyms ?? null),
    antonyms: ensureAtLeastOne(editingUnit.antonyms ?? null),
    examples: ensureAtLeastOne(editingUnit.examples ?? null),
    comment: editingUnit.comment ?? '',
    imageUrl: editingUnit.imageUrl ?? '',
    audio: null,
    soundMeaning: null,
    soundExample: null,
  };
}

export function buildPayload(
  data: AddLexicalUnitFormValues,
  audioBlob: Blob | null,
  meaningAudioBlob: Blob | null,
  exampleAudioBlob: Blob | null,
): AddLexicalUnitFormValues {
  const normalized = normalizeValue(data.value ?? '');
  const type = computeTypeByValue(normalized);
  const normalizedExamples = trimNonEmpty(data.examples ?? []);
  const normalizedSynonyms = trimNonEmpty(data.synonyms ?? []);
  const normalizedAntonyms = trimNonEmpty(data.antonyms ?? []);

  return {
    ...data,
    value: normalized,
    type,
    audio: audioBlob ?? undefined,
    soundMeaning: meaningAudioBlob ?? undefined,
    soundExample: exampleAudioBlob ?? undefined,
    examples: normalizedExamples?.length ? normalizedExamples : null,
    synonyms: normalizedSynonyms?.length ? normalizedSynonyms : null,
    antonyms: normalizedAntonyms?.length ? normalizedAntonyms : null,
  };
}

export function useObjectUrl(blob: Blob | null) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!blob) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUrl(null);
      return;
    }

    const nextUrl = URL.createObjectURL(blob);
    setUrl(nextUrl);

    return () => URL.revokeObjectURL(nextUrl);
  }, [blob]);

  return url;
}

export const PARTS_OF_SPEECH: PartsOfSpeech[] = [
  'noun',
  'pronoun',
  'verb',
  'adjective',
  'adverb',
  'preposition',
  'conjunction',
  'interjunction',
  'article',
  'numeral',
  'particle',
];

export const PARTS_OPTIONS: { value: PartsOfSpeech; label: string }[] = PARTS_OF_SPEECH.map(
  (part) => ({
    value: part,
    label: part,
  }),
);