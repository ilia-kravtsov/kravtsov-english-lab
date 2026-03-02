import { useCallback, useEffect, useRef, useState } from 'react';

export type SwitchDir = 'next' | 'prev';

export function useSwitchAnimation(totalMs = 260) {
  const [dir, setDir] = useState<SwitchDir | null>(null);
  const endRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (endRef.current) window.clearTimeout(endRef.current);
    };
  }, []);

  const trigger = useCallback((d: SwitchDir) => {
    setDir(d);
    if (endRef.current) window.clearTimeout(endRef.current);
    endRef.current = window.setTimeout(() => setDir(null), totalMs);
  }, [totalMs]);

  return { dir, trigger, totalMs };
}