import { type Dispatch, type MouseEvent, type SetStateAction,useEffect, useMemo, useRef } from 'react';

import type { CardWithLexicalUnit } from '@/entities/card/model/card.types.ts';
import type {
  PracticeSwitchDir,
  PracticeSwitchState,
} from '@/features/vocabulary/card-practice/model/practice-mode.types.ts';
import { toAbsoluteMediaUrl } from '@/shared/lib/url/toAbsoluteMediaUrl.ts';

type Params = {
  items: CardWithLexicalUnit[];
  index: number;
  isFlipped: boolean;
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
  setIndex: Dispatch<SetStateAction<number>>;
  switchDir: PracticeSwitchState;
  triggerSwitch: (dir: PracticeSwitchDir) => void;
};

export function useStandardPractice({
                                      items,
                                      index,
                                      isFlipped,
                                      setIsFlipped,
                                      setIndex,
                                      switchDir,
                                      triggerSwitch,
                                    }: Params) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const current = items[index] ?? null;
  const unit = current?.lexicalUnit ?? null;
  const isLastCard = index >= items.length - 1;

  const audioSrc = useMemo(() => {
    const url = unit?.audioUrl;
    if (!url) return null;
    return toAbsoluteMediaUrl(url);
  }, [unit]);

  const hasBackContent = Boolean(unit?.translation || unit?.synonyms?.length || unit?.meaning);

  const animateSwitch = (dir: PracticeSwitchDir, commit: () => void) => {
    if (items.length === 0) return;
    if (switchDir) return;

    setIsFlipped(false);
    triggerSwitch(dir);

    window.setTimeout(() => {
      commit();
    }, 130);
  };

  const next = () => {
    if (index >= items.length - 1) return;

    animateSwitch('next', () => {
      setIndex((i) => Math.min(i + 1, items.length - 1));
    });
  };

  const prev = () => {
    if (index <= 0) return;

    animateSwitch('prev', () => {
      setIndex((i) => Math.max(i - 1, 0));
    });
  };

  const restart = () => {
    if (items.length === 0) return;
    if (switchDir) return;
    if (index === 0 && !isFlipped) return;

    animateSwitch('prev', () => {
      setIndex(0);
    });
  };

  const toggleFlip = () => {
    setIsFlipped((v) => !v);
  };

  const playAudio = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    void audioRef.current.play();
  };

  const playHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    playAudio();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName?.toLowerCase();

      if (tag === 'input' || tag === 'textarea') return;

      if (e.code === 'Space') {
        e.preventDefault();
        toggleFlip();
        return;
      }

      if (e.key === 'ArrowRight') {
        if (switchDir) return;
        if (index < items.length - 1) {
          e.preventDefault();
          next();
        }
        return;
      }

      if (e.key === 'ArrowLeft') {
        if (switchDir) return;
        if (index > 0) {
          e.preventDefault();
          prev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [index, items.length, switchDir]);

  return {
    audioRef,
    current,
    unit,
    isLastCard,
    audioSrc,
    hasBackContent,
    next,
    prev,
    restart,
    toggleFlip,
    playHandler,
    animateSwitch,
  };
}