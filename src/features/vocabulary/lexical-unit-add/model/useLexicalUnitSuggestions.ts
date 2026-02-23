import { useEffect, useMemo, useRef, useState } from 'react';

import { suggestLexicalUnits } from '@/entities/lexical-unit/api/lexical-unit.api';
import type { LexicalUnitSuggestion } from '@/entities/lexical-unit/model/lexical-unit.types';

type State =
  | { status: 'idle'; items: [] }
  | { status: 'loading'; items: LexicalUnitSuggestion[] }
  | { status: 'ready'; items: LexicalUnitSuggestion[] }
  | { status: 'error'; items: [] };

function norm(s: string) {
  return s.trim().replace(/\s+/g, ' ');
}

export function useLexicalUnitSuggestions(query: string, limit = 3) {
  const [state, setState] = useState<State>({ status: 'idle', items: [] });
  const q = useMemo(() => query.trim(), [query]);
  const qLower = useMemo(() => q.toLowerCase(), [q]);
  const lastReqId = useRef(0);
  const lockedValueLowerRef = useRef<string | null>(null);
  const lockedItemsRef = useRef<LexicalUnitSuggestion[] | null>(null);

  useEffect(() => {
    if (!q) {
      lockedValueLowerRef.current = null;
      lockedItemsRef.current = null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState({ status: 'idle', items: [] });
      return;
    }

    const lockedValueLower = lockedValueLowerRef.current;
    const lockedItems = lockedItemsRef.current;

    if (lockedValueLower && lockedItems && lockedItems.length === 1) {
      if (lockedValueLower.startsWith(qLower)) {
        setState({ status: 'ready', items: lockedItems });
        return;
      }

      lockedValueLowerRef.current = null;
      lockedItemsRef.current = null;
    }

    const reqId = ++lastReqId.current;
    setState(prev => ({ status: 'loading', items: prev.items }));

    const t = window.setTimeout(() => {
      void (async () => {
        try {
          const items = (await suggestLexicalUnits(q, limit)).slice(0, limit);
          if (lastReqId.current !== reqId) return;

          if (items.length === 1) {
            lockedValueLowerRef.current = norm(items[0].value).toLowerCase();
            lockedItemsRef.current = items;
          } else {
            lockedValueLowerRef.current = null;
            lockedItemsRef.current = null;
          }

          setState({ status: 'ready', items });
        } catch {
          if (lastReqId.current !== reqId) return;
          lockedValueLowerRef.current = null;
          lockedItemsRef.current = null;
          setState({ status: 'error', items: [] });
        }
      })();
    }, 200);

    return () => {
      window.clearTimeout(t);
    };
  }, [q, qLower, limit]);

  return state;
}