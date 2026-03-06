import {
  type ChangeEvent,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { LexicalUnit } from '@/entities/lexical-unit';
import type { LexicalUnitSearchResultState } from '@/features/vocabulary/lexical-unit-add/model/useLexicalUnitSearch';
import { useLexicalUnitSuggestions } from '@/features/vocabulary/lexical-unit-add/model/useLexicalUnitSuggestions.ts';
import { Button } from '@/shared/ui';
import { Input } from '@/shared/ui/Input/Input';

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

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsSuggestOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void runSearch();
      setIsSuggestOpen(false);
    }

    if (e.key === 'Escape') {
      setIsSuggestOpen(false);
    }
  };

  const handleSearch = async () => {
    await runSearch();
    setIsSuggestOpen(false);
  };

  const showSuggest =
    isSuggestOpen &&
    normalizedQuery &&
    suggestions.status !== 'error' &&
    suggestions.items.length > 0 &&
    result.status !== 'loading';

  const handlePickSuggestion = async (value: string) => {
    setIsSuggestOpen(false);
    await runSearch(value);
  };

  return (
    <div className={style.container}>
      <div className={style.searchRow}>
        <div className={style.inputWrap} ref={suggestWrapRef}>
          <Input
            value={query}
            onChange={changeHandler}
            placeholder={'Find lexical unit in the bank'}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsSuggestOpen(true)}
          />

          {showSuggest && (
            <div className={style.suggestBox} role={'listbox'}>
              {suggestions.items.slice(0, 3).map((item) => (
                <button
                  key={item.id}
                  type={'button'}
                  className={style.suggestItem}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => void handlePickSuggestion(item.value)}
                >
                  <span className={style.suggestValue}>{item.value}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <Button
          type={'button'}
          title={result.status === 'loading' ? 'Searching...' : 'Search'}
          disabled={result.status === 'loading' || !normalizedQuery}
          onClick={handleSearch}
          style={{ width: '120px' }}
        />
      </div>

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

      {result.status === 'found' && (
        <div className={style.resultBox}>
          <div className={style.fields}>
            <div className={style.fieldRow}>
              <span className={style.value}>{result.unit.value}</span>

              {result.unit.translation && (
                <div className={style.fieldRow}>
                  <span className={style.value}>{result.unit.translation}</span>
                </div>
              )}
            </div>

            <div className={style.fieldRow}>
              {result.unit.transcription && (
                <div className={style.fieldRow}>
                  <span className={style.value}>{result.unit.transcription}</span>
                </div>
              )}

              {audioSrc && audioRef && playAudio && (
                <div className={style.fieldBlock}>
                  <audio
                    ref={audioRef}
                    src={audioSrc}
                    preload={'metadata'}
                    style={{ display: 'none' }}
                  />
                  <Button
                    type={'button'}
                    title={'Play'}
                    onClick={playAudio}
                    style={{ width: '80px' }}
                  />
                </div>
              )}
            </div>

            {variant === 'full' && (
              <>
                {result.unit.meaning && (
                  <div className={style.fieldRow}>
                    <span className={style.value}>{result.unit.meaning}</span>
                  </div>
                )}

                {meaningAudioSrc && meaningAudioRef && playMeaningAudio && (
                  <div className={style.fieldBlock}>
                    <audio ref={meaningAudioRef} src={meaningAudioSrc} preload="metadata" hidden />
                    <Button
                      type="button"
                      title="Play meaning"
                      onClick={playMeaningAudio}
                      style={{ width: '80px' }}
                    />
                  </div>
                )}

                {result.unit.partsOfSpeech?.length ? (
                  <div className={style.fieldRow}>
                    <span className={style.value}>{result.unit.partsOfSpeech.join(', ')}</span>
                  </div>
                ) : null}

                {result.unit.synonyms?.length && <span>{result.unit.synonyms.join(', ')}</span>}
                {result.unit.antonyms?.length && <span>{result.unit.antonyms.join(', ')}</span>}

                {result.unit.examples && (
                  <div className={style.fieldBlock}>
                    <div className={style.label}>Examples:</div>
                    <div className={style.value}>{result.unit.examples}</div>
                  </div>
                )}

                {exampleAudioSrc && (
                  <div className={style.fieldBlock}>
                    <audio ref={exampleAudioRef} src={exampleAudioSrc} preload={'metadata'} />
                    <Button
                      type={'button'}
                      title={'Play example'}
                      onClick={playExampleAudio}
                      style={{ width: '80px' }}
                    />
                  </div>
                )}

                {result.unit.comment && (
                  <div className={style.fieldBlock}>
                    <div className={style.value}>{result.unit.comment}</div>
                  </div>
                )}
              </>
            )}
          </div>

          {variant === 'full' && imageSrc && (
            <div className={style.imageBox}>
              <img src={imageSrc} alt={result.unit.value} />
            </div>
          )}

          {renderFoundActions && (
            <div className={style.actions}>{renderFoundActions(result.unit)}</div>
          )}
        </div>
      )}
    </div>
  );
}
