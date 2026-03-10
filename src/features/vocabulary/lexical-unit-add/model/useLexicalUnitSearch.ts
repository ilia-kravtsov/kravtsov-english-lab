import { useRef, useState } from 'react';
import { toast } from 'react-toastify';

import { searchLexicalUnitByValue } from '@/entities/lexical-unit/api/lexical-unit.api';
import type { LexicalUnit } from '@/entities/lexical-unit/model/lexical-unit.types';
import { API_BASE_URL } from '@/shared/config/api.ts';
import { isAbsoluteUrl } from '@/shared/lib/url/isAbsoluteUrl.ts';

const toAbsUrl = (url?: string | null): string | null => {
  if (!url) return null;
  if (isAbsoluteUrl(url)) return url;
  return `${API_BASE_URL}${url}`;
};

const useCreateAudioControls = (src: string | null) => {
  const ref = useRef<HTMLAudioElement | null>(null);

  const play = () => {
    if (!ref.current || !src) return;
    ref.current.currentTime = 0;
    void ref.current.play();
  };

  return { ref, src, play };
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

  const requestIdRef = useRef(0);

  const normalizedQuery = query.trim();
  const unit = result.status === 'found' ? result.unit : null;

  const audioSrc = toAbsUrl(unit?.audioUrl);
  const meaningAudioSrc = toAbsUrl(unit?.soundMeaningUrl);
  const exampleAudioSrc = toAbsUrl(unit?.soundExampleUrl);
  const imageSrc = unit?.imageUrl ?? null;

  const { ref: audioRef, play: playAudio } = useCreateAudioControls(audioSrc);
  const { ref: meaningAudioRef, play: playMeaningAudio } = useCreateAudioControls(meaningAudioSrc);
  const { ref: exampleAudioRef, play: playExampleAudio } = useCreateAudioControls(exampleAudioSrc);

  const resetResult = () => {
    setResult({ status: 'idle' });
  };

  const runSearch = async (valueArg?: string) => {
    const value = (valueArg ?? normalizedQuery).trim();
    if (!value) {
      setResult({ status: 'idle' });
      return;
    }

    const requestId = ++requestIdRef.current;

    setResult({ status: 'loading' });

    try {
      const data = await searchLexicalUnitByValue(value);

      if (requestId !== requestIdRef.current) return;

      if (!data) {
        setResult({ status: 'not-found' });
        return;
      }

      setResult({ status: 'found', unit: data });
      setQuery('');
    } catch {
      if (requestId !== requestIdRef.current) return;

      setResult({ status: 'error' });
      toast.error('Search failed');
    }
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
