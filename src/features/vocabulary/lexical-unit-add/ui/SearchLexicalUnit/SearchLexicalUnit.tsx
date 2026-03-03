import style from './SearchLexicalUnit.module.scss';
import { Button, ConfirmModal } from '@/shared/ui';
import { useSearchLexicalUnit } from '@/features/vocabulary/lexical-unit-add/model/useSearchLexicalUnit.ts';
import { LexicalUnitSearchPanel } from '@/features/vocabulary/lexical-unit-add/ui/LexicalUnitSearchPanel/LexicalUnitSearchPanel';

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

    meaningAudioRef,
    meaningAudioSrc,
    playMeaningAudio,

    exampleAudioRef,
    exampleAudioSrc,
    playExampleAudio,

    imageSrc,
  } = useSearchLexicalUnit();

  return (
    <div className={style.container}>
      <LexicalUnitSearchPanel
        query={query}
        setQuery={setQuery}
        normalizedQuery={normalizedQuery}
        result={result}
        runSearch={runSearch}
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
        variant={'full'}
        renderNotFound={() => (
          <>
            <div className={style.hint}>Not found in your bank — you can add it.</div>
            <Button type={'button'} title={'Add'} onClick={handleAdd} style={{ width: '200px' }} />
          </>
        )}
        renderFoundActions={() => (
          <>
            <Button type={'button'} title={'Update'} onClick={handleUpdate} style={{ width: '120px' }} />
            <Button
              type={'button'}
              title={'Delete'}
              disabled={deleting}
              onClick={handleDeleteClick}
              style={{ width: '120px' }}
            />
          </>
        )}
      />

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