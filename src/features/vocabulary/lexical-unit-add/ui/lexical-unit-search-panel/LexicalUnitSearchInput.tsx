import type { ChangeEvent, KeyboardEvent, RefObject } from 'react';

import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui/input/Input.tsx';

import style from './LexicalUnitSearchPanel.module.scss';

type SuggestionItem = {
  id: string;
  value: string;
};

type Props = {
  query: string;
  isLoading: boolean;
  normalizedQuery: string;
  suggestWrapRef: RefObject<HTMLDivElement | null>;
  suggestions: SuggestionItem[];
  showSuggest: boolean;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  onFocus: () => void;
  onSearch: () => void;
  onPickSuggestion: (value: string) => void;
};

const searchButtonStyle = { width: '120px' };

export function LexicalUnitSearchInput({
                                         query,
                                         isLoading,
                                         normalizedQuery,
                                         suggestWrapRef,
                                         suggestions,
                                         showSuggest,
                                         onChange,
                                         onKeyDown,
                                         onFocus,
                                         onSearch,
                                         onPickSuggestion,
                                       }: Props) {
  return (
    <div className={style.searchRow}>
      <div className={style.inputWrap} ref={suggestWrapRef}>
        <Input
          value={query}
          onChange={onChange}
          placeholder={'Find words in the bank'}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
        />

        {showSuggest && (
          <div className={style.suggestBox} role={'listbox'}>
            {suggestions.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type={'button'}
                className={style.suggestItem}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onPickSuggestion(item.value)}
              >
                <span className={style.suggestValue}>{item.value}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <Button
        type={'button'}
        title={isLoading ? 'Searching...' : 'Search'}
        disabled={isLoading || !normalizedQuery}
        onClick={onSearch}
        style={searchButtonStyle}
      />
    </div>
  );
}