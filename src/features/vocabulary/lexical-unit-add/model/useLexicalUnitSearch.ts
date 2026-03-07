import { useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { searchLexicalUnitByValue } from '@/entities/lexical-unit/api/lexical-unit.api';
import type { LexicalUnit } from '@/entities/lexical-unit/model/lexical-unit.types';

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

const toAbsUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${apiBaseUrl}${url}`;
};

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
  const meaningAudioRef = useRef<HTMLAudioElement | null>(null);
  const exampleAudioRef = useRef<HTMLAudioElement | null>(null);

  const audioSrc = useMemo(() => {
    if (result.status !== 'found') return null;

    const url = result.unit.audioUrl;
    if (!url) return null;

    if (url.startsWith('http://') || url.startsWith('https://')) return url;

    return `${apiBaseUrl}${url}`;
  }, [result]);
  const meaningAudioSrc = useMemo(() => {
    if (result.status !== 'found') return null;
    return toAbsUrl(result.unit.soundMeaningUrl);
  }, [result]);
  const exampleAudioSrc = useMemo(() => {
    if (result.status !== 'found') return null;
    return toAbsUrl(result.unit.soundExampleUrl);
  }, [result]);

  const imageSrc = useMemo(() => {
    if (result.status !== 'found') return null;
    return result.unit.imageUrl ?? null;
  }, [result]);

  const resetResult = () => {
    setResult({ status: 'idle' });
  };

  const runSearch = async (valueArg?: string) => {
    const value = (valueArg ?? normalizedQuery).trim();
    if (!value) {
      setResult({ status: 'idle' });
      return;
    }

    setResult({ status: 'loading' });
    try {
      const data = await searchLexicalUnitByValue(value);
      if (!data) {
        setResult({ status: 'not-found' });
        setQuery('');
        return;
      }
      setResult({ status: 'found', unit: data });
      setQuery('');
    } catch {
      setResult({ status: 'error' });
      toast.error('Search failed');
      setQuery('');
    }
  };

  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    void audioRef.current.play();
  };
  const playMeaningAudio = () => {
    if (!meaningAudioRef.current) return;
    meaningAudioRef.current.currentTime = 0;
    void meaningAudioRef.current.play();
  };
  const playExampleAudio = () => {
    if (!exampleAudioRef.current) return;
    exampleAudioRef.current.currentTime = 0;
    void exampleAudioRef.current.play();
  };

  return {
    query,
    setQuery,
    normalizedQuery,
    result,

    runSearch,
    resetResult,

    audioRef,
    audioSrc,
    playAudio,

    meaningAudioRef,
    meaningAudioSrc,
    playMeaningAudio,

    exampleAudioRef,
    exampleAudioSrc,
    playExampleAudio,

    imageSrc,
  };
}
