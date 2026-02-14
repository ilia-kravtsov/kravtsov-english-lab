import { type ChangeEvent, type KeyboardEvent, useMemo, useState } from 'react';
import style from './SearchLexicalUnit.module.scss';
import { Input } from '@/shared/ui/Input/Input.tsx';
import { Button } from '@/shared/ui';
import { deleteLexicalUnit, searchLexicalUnitByValue } from '@/entities/lexical-unit/api/lexical-unit.api.ts';
import type { LexicalUnit } from '@/entities/lexical-unit/model/lexical-unit.types.ts';
import { useLexicalUnitEditorStore } from '@/features/vocabulary/lexical-unit-add/model/lexicalUnitEditor.store.ts';
const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

type ResultState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'found'; unit: LexicalUnit };

export function SearchLexicalUnit() {
  const openAddWithValue = useLexicalUnitEditorStore(s => s.openAddWithValue);
  const openUpdate = useLexicalUnitEditorStore(s => s.openUpdate);

  const [query, setQuery] = useState('');
  const [result, setResult] = useState<ResultState>({ status: 'idle' });

  const normalizedQuery = useMemo(() => query.trim(), [query]);

  const runSearch = async () => {
    const value = normalizedQuery;
    if (!value) {
      setResult({ status: 'idle' });
      return;
    }

    setResult({ status: 'loading' });
    try {
      const data = await searchLexicalUnitByValue(value);
      if (!data) {
        setResult({ status: 'not-found' });
        return;
      }
      setResult({ status: 'found', unit: data });
    } catch (e) {
      console.error(e);
      setResult({ status: 'not-found' });
    }
  };

  const handleAdd = () => {
    const value = normalizedQuery;
    if (!value) return;
    openAddWithValue(value);
  };

  const handleUpdate = () => {
    if (result.status !== 'found') return;
    openUpdate(result.unit);
  };

  const handleDelete = async () => {
    if (result.status !== 'found') return;
    const { unit } = result;

    try {
      await deleteLexicalUnit(unit.id);
      setResult({ status: 'not-found' });
    } catch (e) {
      console.error(e);
      alert('Failed to delete');
    }
  };

  const audioSrc = useMemo(() => {
    if (result.status !== 'found') return null;

    const url = result.unit.audioUrl;

    if (!url) return null;

    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }

    return `${apiBaseUrl}${url}`;
  }, [result]);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void runSearch();
    }
  };

  return (
    <div className={style.container}>
      <div className={style.searchRow}>
        <Input
          value={query}
          onChange={changeHandler}
          placeholder={'Find lexical unit in the bank'}
          onKeyDown={handleKeyDown}
        />

        <Button
          type={'button'}
          title={result.status === 'loading' ? 'Searching...' : 'Search'}
          disabled={result.status === 'loading' || !normalizedQuery}
          onClick={() => void runSearch()}
          style={{ width: '120px' }}
        />
      </div>

      {result.status === 'loading' && <div className={style.hint}>Searching…</div>}

      {result.status === 'not-found' && (
        <div className={style.notFoundBox}>
          <div className={style.hint}>Not found in your bank — you can add it.</div>
          <Button type={'button'} title={'Add'} onClick={handleAdd} style={{ width: '200px' }} />
        </div>
      )}

      {result.status === 'found' && (
        <div className={style.resultBox}>
          <div className={style.fields}>
            <div className={style.fieldRow}>
              <span className={style.value}>{result.unit.value}</span>
              {result.unit.transcription && (
                <div className={style.fieldRow}>
                  <span className={style.value}>{result.unit.transcription}</span>
                </div>
              )}
              {audioSrc && (
                <div className={style.fieldBlock}>
                  <audio controls preload={"metadata"} src={audioSrc} />
                </div>
              )}
            </div>

            <div className={style.fieldRow}>
              {result.unit.partsOfSpeech && (
                <div className={style.fieldRow}>
                  <span className={style.value}>{result.unit.partsOfSpeech}</span>
                </div>
              )}

              {result.unit.translation && (
                <div className={style.fieldRow}>
                  <span className={style.value}>{result.unit.translation}</span>
                </div>
              )}
            </div>

            {result.unit.meaning && (
              <div className={style.fieldRow}>
                <span className={style.value}>{result.unit.meaning}</span>
              </div>
            )}

            {result.unit.synonyms && (
              <div className={style.fieldRow}>
                <span className={style.label}>Synonyms:</span>
                <span className={style.value}>{result.unit.synonyms}</span>
              </div>
            )}

            {result.unit.antonyms && (
              <div className={style.fieldRow}>
                <span className={style.label}>Antonyms:</span>
                <span className={style.value}>{result.unit.antonyms}</span>
              </div>
            )}

            {result.unit.examples && (
              <div className={style.fieldBlock}>
                <div className={style.label}>Examples:</div>
                <div className={style.value}>{result.unit.examples}</div>
              </div>
            )}

            {result.unit.comment && (
              <div className={style.fieldBlock}>
                <div className={style.label}>Comment:</div>
                <div className={style.value}>{result.unit.comment}</div>
              </div>
            )}
          </div>

          <div className={style.actions}>
            <Button type={'button'} title={'Update'} onClick={handleUpdate} style={{ width: '120px' }} />
            <Button type={'button'} title={'Delete'} onClick={() => void handleDelete()} style={{ width: '120px' }} />
          </div>
        </div>
      )}
    </div>
  );
}
