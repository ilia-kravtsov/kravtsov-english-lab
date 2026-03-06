import { useCallback, useEffect, useRef, useState } from 'react';

import type {
  PracticeSwitchDir,
  PracticeSwitchState,
} from '@/features/vocabulary/card-practice/model/practice-mode.types.ts';

export function useSwitchAnimation(totalMs = 260) {
  const [dir, setDir] = useState<PracticeSwitchState>(null);
  const endRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (endRef.current) window.clearTimeout(endRef.current);
    };
  }, []);

  const trigger = useCallback(
    (d: PracticeSwitchDir) => {
      setDir(d);
      if (endRef.current) window.clearTimeout(endRef.current);
      endRef.current = window.setTimeout(() => setDir(null), totalMs);
    },
    [totalMs],
  );

  return { dir, trigger, totalMs };
}
