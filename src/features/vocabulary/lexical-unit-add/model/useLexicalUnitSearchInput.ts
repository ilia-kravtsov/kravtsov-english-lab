import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { LexicalUnitSearchResultState } from './useLexicalUnitSearchQuery.ts';
import { useLexicalUnitSuggestions } from './useLexicalUnitSuggestions';

type Params = {
  query: string;
  setQuery: (value: string) => void;
  normalizedQuery: string;
  result: LexicalUnitSearchResultState;
  runSearch: (valueArg?: string) => Promise<void> | void;
};

export function useLexicalUnitSearchInput({
                                            query,
                                            setQuery,
                                            normalizedQuery,
                                            result,
                                            runSearch,
                                          }: Params) {
  const [isSuggestOpen, setIsSuggestOpen] = useState(false);
  const suggestWrapRef = useRef<HTMLDivElement | null>(null);

  const suggestions = useLexicalUnitSuggestions(query, 3);

  useEffect(() => {
    if (!isSuggestOpen) return;

    const onMouseDown = (e: MouseEvent) => {
      const wrap = suggestWrapRef.current;
      if (!wrap) return;
      if (wrap.contains(e.target as Node)) return;
      setIsSuggestOpen(false);
    };

    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [isSuggestOpen]);

  const showSuggest = useMemo(
    () =>
      isSuggestOpen &&
      !!normalizedQuery &&
      suggestions.status !== 'error' &&
      suggestions.items.length > 0 &&
      result.status !== 'loading',
    [isSuggestOpen, normalizedQuery, suggestions.status, suggestions.items.length, result.status],
  );

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsSuggestOpen(true);
  };

  const closeSuggestions = () => {
    setIsSuggestOpen(false);
  };

  const handleFocus = () => {
    setIsSuggestOpen(true);
  };

  const handleSearch = async () => {
    await runSearch();
    setIsSuggestOpen(false);
  };

  const handlePickSuggestion = async (value: string) => {
    setIsSuggestOpen(false);
    await runSearch(value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void handleSearch();
      return;
    }

    if (e.key === 'Escape') {
      setIsSuggestOpen(false);
    }
  };

  return {
    suggestWrapRef,
    suggestions,
    showSuggest,

    changeHandler,
    handleKeyDown,
    handleFocus,
    handleSearch,
    handlePickSuggestion,
    closeSuggestions,
  };
}