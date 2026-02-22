import { useMemo, useRef, useState } from 'react';

import { searchLexicalUnitByValue } from '@/entities/lexical-unit/api/lexical-unit.api';
import type { LexicalUnit } from '@/entities/lexical-unit/model/lexical-unit.types';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export type LexicalUnitSearchResultState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'found'; unit: LexicalUnit }
  | { status: 'error' };

export function useLexicalUnitSearch() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<LexicalUnitSearchResultState>({ status: 'idle' });

  const normalizedQuery = useMemo(() => query.trim(), [query]);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioSrc = useMemo(() => {
    if (result.status !== 'found') return null;

    const url = result.unit.audioUrl;
    if (!url) return null;

    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    return `${apiBaseUrl}${url}`;
  }, [result]);

  const imageSrc = useMemo(() => {
    if (result.status !== 'found') return null;
    return result.unit.imageUrl ?? null;
  }, [result]);

  const runSearch = async () => {
    const value = normalizedQuery;
    if (!value) {
      setResult({ status: 'idle' });
      return;
    }

    setResult({ status: 'loading' });
    try {
      const data = await searchLexicalUnitByValue(value);
      if (!data) {
        setResult({ status: 'not-found' });
        return;
      }
      setResult({ status: 'found', unit: data });
    } catch (e) {
      console.error(e);
      setResult({ status: 'error' });
    }
  };

  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    void audioRef.current.play();
  };

  return {
    query,
    setQuery,
    normalizedQuery,
    result,

    runSearch,

    audioRef,
    audioSrc,
    playAudio,

    imageSrc,
  };
}