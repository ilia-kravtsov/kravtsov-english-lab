import { type ReactNode, type RefObject } from 'react';

import type { LexicalUnit } from '@/entities/lexical-unit';
import type { LexicalUnitSearchResultState } from '@/features/vocabulary/lexical-unit-add/model/useLexicalUnitSearch';
import { useLexicalUnitSearchPanel } from '@/features/vocabulary/lexical-unit-add/model/useLexicalUnitSearchPanel';
import { LexicalUnitSearchInput } from '@/features/vocabulary/lexical-unit-add/ui/LexicalUnitSearchPanel/components/LexicalUnitSearchInput.tsx';
import { LexicalUnitSearchResult } from '@/features/vocabulary/lexical-unit-add/ui/LexicalUnitSearchPanel/components/LexicalUnitSearchResult.tsx';

import style from './LexicalUnitSearchPanel.module.scss';

type Props = {
  query: string;
  setQuery: (v: string) => void;
  normalizedQuery: string;
  result: LexicalUnitSearchResultState;
  runSearch: (valueArg?: string) => Promise<void> | void;

  audioRef?: RefObject<HTMLAudioElement | null>;
  audioSrc?: string | null;
  playAudio?: () => void;

  meaningAudioRef?: RefObject<HTMLAudioElement | null>;
  meaningAudioSrc?: string | null;
  playMeaningAudio?: () => void;

  exampleAudioRef?: RefObject<HTMLAudioElement | null>;
  exampleAudioSrc?: string | null;
  playExampleAudio?: () => void;

  imageSrc?: string | null;

  variant?: 'full' | 'compact';

  renderNotFound?: () => ReactNode;
  renderFoundActions?: (unit: LexicalUnit) => ReactNode;
};

export function LexicalUnitSearchPanel({
  query,
  setQuery,
  normalizedQuery,
  result,
  runSearch,

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

  variant = 'full',

  renderNotFound,
  renderFoundActions,
}: Props) {

  const {
    suggestWrapRef,
    suggestions,
    showSuggest,
    changeHandler,
    handleKeyDown,
    handleFocus,
    handleSearch,
    handlePickSuggestion,
  } = useLexicalUnitSearchPanel({
    query,
    setQuery,
    normalizedQuery,
    result,
    runSearch,
  });

  const unit = result.status === 'found' ? result.unit : null;

  return (
    <div className={style.container}>
      <LexicalUnitSearchInput
        query={query}
        isLoading={result.status === 'loading'}
        normalizedQuery={normalizedQuery}
        suggestWrapRef={suggestWrapRef}
        suggestions={suggestions.items}
        showSuggest={showSuggest}
        onChange={changeHandler}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onSearch={() => void handleSearch()}
        onPickSuggestion={(value) => void handlePickSuggestion(value)}
      />

      {result.status === 'loading' && <div className={style.hint}>Searching…</div>}

      {result.status === 'error' && <div className={style.error}>Search failed.</div>}

      {result.status === 'not-found' && (
        <div className={style.notFoundBox}>
          {renderNotFound ? (
            renderNotFound()
          ) : (
            <div className={style.hint}>Not found in your bank.</div>
          )}
        </div>
      )}

      {unit && (
        <LexicalUnitSearchResult
          unit={unit}
          variant={variant}
          audioRef={audioRef}
          audioSrc={audioSrc}
          playAudio={playAudio}
          meaningAudioRef={meaningAudioRef}
          meaningAudioSrc={meaningAudioSrc}
          playMeaningAudio={playMeaningAudio}
          exampleAudioRef={exampleAudioRef}
          exampleAudioSrc={exampleAudioSrc}
          playExampleAudio={playExampleAudio}
          imageSrc={imageSrc}
          renderFoundActions={renderFoundActions}
        />
      )}
    </div>
  );
}