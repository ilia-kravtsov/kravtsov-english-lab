import style from './PracticeModeSidebar.module.scss';
import type { PracticeMode } from '@/features/vocabulary/card-practice/model/practice-mode.types.ts';

type Props = {
  mode: PracticeMode;
  loading: boolean;
  hasItems: boolean;
  recognitionAvailable: boolean;
  typingAvailable: boolean;
  listeningAvailable: boolean;
  contextAvailable: boolean;
  onStandardClick: () => void;
  onRecognitionClick: () => void;
  onTypingClick: () => void;
  onListeningClick: () => void;
  onContextClick: () => void;
};

export function PracticeModeSidebar({
                                      mode,
                                      loading,
                                      hasItems,
                                      recognitionAvailable,
                                      typingAvailable,
                                      listeningAvailable,
                                      contextAvailable,
                                      onStandardClick,
                                      onRecognitionClick,
                                      onTypingClick,
                                      onListeningClick,
                                      onContextClick,
                                    }: Props) {
  return (
    <div className={style.left}>
      <h3 className={style.sectionTitle}>Mode</h3>

      <div className={style.modeList}>
        <button
          type={'button'}
          className={mode === 'standard' ? style.modeBtnActive : style.modeBtn}
          onClick={onStandardClick}
        >
          Standard
        </button>

        <button
          type={'button'}
          className={mode === 'recognition' ? style.modeBtnActive : style.modeBtn}
          onClick={onRecognitionClick}
          disabled={!recognitionAvailable || loading || !hasItems}
        >
          Recognition
        </button>

        <button
          type={'button'}
          className={mode === 'typing' ? style.modeBtnActive : style.modeBtn}
          onClick={onTypingClick}
          disabled={!typingAvailable || loading || !hasItems}
        >
          Typing
        </button>

        <button
          type={'button'}
          className={mode === 'listening' ? style.modeBtnActive : style.modeBtn}
          onClick={onListeningClick}
          disabled={!listeningAvailable || loading || !hasItems}
        >
          Listening
        </button>

        <button
          type={'button'}
          className={mode === 'context' ? style.modeBtnActive : style.modeBtn}
          onClick={onContextClick}
          disabled={!contextAvailable || loading || !hasItems}
        >
          Context
        </button>
      </div>

      {!loading && hasItems && !recognitionAvailable && (
        <div className={style.modeHint}>
          Recognition needs at least 2 cards with translation.
        </div>
      )}

      {!loading && hasItems && !contextAvailable && (
        <div className={style.modeHint}>
          Context needs at least 1 card with example containing lexical unit.
        </div>
      )}
    </div>
  );
}