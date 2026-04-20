import type { PracticeMode } from '@/features/vocabulary/card-practice/shared/model/practice-mode.types.ts';

import style from './PracticeModeSidebar.module.scss';

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

  const modes = [
    {
      key: 'standard',
      label: 'Standard',
      onClick: onStandardClick,
    },
    {
      key: 'recognition',
      label: 'Recognition',
      onClick: onRecognitionClick,
      disabled: !recognitionAvailable || loading || !hasItems,
    },
    {
      key: 'typing',
      label: 'Typing',
      onClick: onTypingClick,
      disabled: !typingAvailable || loading || !hasItems,
    },
    {
      key: 'listening',
      label: 'Listening',
      onClick: onListeningClick,
      disabled: !listeningAvailable || loading || !hasItems,
    },
    {
      key: 'context',
      label: 'Context',
      onClick: onContextClick,
      disabled: !contextAvailable || loading || !hasItems,
    },
  ];

  return (
    <div className={style.left}>
      <h3 className={style.sectionTitle}>Mode</h3>

      <div className={style.modeList}>
        {modes.map(({ key, label, onClick, disabled }) => (
          <button
            key={key}
            type="button"
            className={mode === key ? style.modeBtnActive : style.modeBtn}
            onClick={onClick}
            disabled={disabled}
          >
            {label}
          </button>
        ))}
      </div>

      {!loading && hasItems && !recognitionAvailable && (
        <div className={style.modeHint}>Recognition needs at least 2 cards with translation.</div>
      )}

      {!loading && hasItems && !contextAvailable && (
        <div className={style.modeHint}>
          Context needs at least 1 card with example containing lexical unit.
        </div>
      )}
    </div>
  );
}
