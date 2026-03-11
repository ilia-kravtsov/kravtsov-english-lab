import { type RefObject, useEffect, useMemo, useRef } from 'react';

import { toAbsoluteMediaUrl } from '@/shared/lib/url/to-absolute-media-url.ts';

type Params = {
  cardId?: string;
  audioUrl?: string | null;
};

type Result = {
  audioRef: RefObject<HTMLAudioElement | null>;
  audioSrc: string | null;
  playAudio: () => void;
};

export function useListeningAudio({ cardId, audioUrl }: Params): Result {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const autoPlayedCardKeyRef = useRef<string | null>(null);

  const audioSrc = useMemo(() => toAbsoluteMediaUrl(audioUrl), [audioUrl]);

  useEffect(() => {
    if (!cardId || !audioSrc) return;

    const autoPlayKey = `${cardId}:${audioSrc}`;
    if (autoPlayedCardKeyRef.current === autoPlayKey) return;

    const audio = audioRef.current;
    if (!audio) return;

    autoPlayedCardKeyRef.current = autoPlayKey;

    const tryPlay = async () => {
      try {
        audio.currentTime = 0;
        await audio.play();
      } catch {
        autoPlayedCardKeyRef.current = null;
      }
    };

    if (audio.readyState >= 2) {
      void tryPlay();
      return;
    }

    const handleLoadedData = () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
      void tryPlay();
    };

    audio.addEventListener('loadeddata', handleLoadedData);

    return () => {
      audio.removeEventListener('loadeddata', handleLoadedData);
    };
  }, [cardId, audioSrc]);

  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    void audio.play();
  };

  return {
    audioRef,
    audioSrc,
    playAudio,
  };
}