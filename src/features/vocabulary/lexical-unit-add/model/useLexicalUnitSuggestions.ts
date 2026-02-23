import { useEffect, useMemo, useRef, useState } from 'react';

import { suggestLexicalUnits } from '@/entities/lexical-unit/api/lexical-unit.api';
import type { LexicalUnitSuggestion } from '@/entities/lexical-unit/model/lexical-unit.types';

type State =
  | { status: 'idle'; items: [] }
  | { status: 'loading'; items: LexicalUnitSuggestion[] }
  | { status: 'ready'; items: LexicalUnitSuggestion[] }
  | { status: 'error'; items: [] };

export function useLexicalUnitSuggestions(query: string, limit = 3) {
  const [state, setState] = useState<State>({ status: 'idle', items: [] });
  const q = useMemo(() => query.trim(), [query]);
  const lastReqId = useRef(0);

  useEffect(() => {
    if (!q) {
      setState({ status: 'idle', items: [] });
      return;
    }

    const reqId = ++lastReqId.current;
    setState(prev => ({ status: 'loading', items: prev.items }));

    const t = window.setTimeout(() => {
      void (async () => {
        try {
          const items = await suggestLexicalUnits(q, limit);
          if (lastReqId.current !== reqId) return;
          setState({ status: 'ready', items: items.slice(0, limit) });
        } catch {
          if (lastReqId.current !== reqId) return;
          setState({ status: 'error', items: [] });
        }
      })();
    }, 200);

    return () => {
      window.clearTimeout(t);
    };
  }, [q, limit]);

  return state;
}