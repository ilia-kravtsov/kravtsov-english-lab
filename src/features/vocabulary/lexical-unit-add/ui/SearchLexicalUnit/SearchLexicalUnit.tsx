import { type ChangeEvent, type KeyboardEvent } from 'react';
import style from './SearchLexicalUnit.module.scss';
import { Input } from '@/shared/ui/Input/Input.tsx';
import { Button, ConfirmModal } from '@/shared/ui';
import { useSearchLexicalUnit } from '@/features/vocabulary/lexical-unit-add/model/useSearchLexicalUnit.ts';

export function SearchLexicalUnit() {
  const {
    query,
    setQuery,
    normalizedQuery,
    result,

    runSearch,
    handleAdd,
    handleUpdate,

    confirmOpen,
    deleting,
    handleDeleteClick,
    cancelDelete,
    confirmDelete,

    audioRef,
    audioSrc,
    playAudio,

    imageSrc,
  } = useSearchLexicalUnit();

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

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
                  <audio
                    ref={audioRef}
                    src={audioSrc}
                    preload={"metadata"}
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

            <div className={style.fieldRow}>
              {result.unit.partsOfSpeech?.length ? (
                <div className={style.fieldRow}>
                  <span className={style.value}>{result.unit.partsOfSpeech.join(', ')}</span>
                </div>
              ) : null}

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
                <div className={style.value}>{result.unit.comment}</div>
              </div>
            )}
          </div>


          {imageSrc && (
            <div className={style.imageBox}>
              <img src={imageSrc} alt={result.unit.value} />
            </div>
          )}

          <div className={style.actions}>
            <Button
              type={'button'}
              title={'Update'}
              onClick={handleUpdate}
              style={{ width: '120px' }}
            />
            <Button
              type={'button'}
              title={'Delete'}
              disabled={deleting}
              onClick={handleDeleteClick}
              style={{ width: '120px' }}
            />
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={confirmOpen}
        title={'Delete lexical unit?'}
        message={'This action cannot be undone.'}
        onCancel={cancelDelete}
        onConfirm={() => void confirmDelete()}
      />
    </div>
  );
}
