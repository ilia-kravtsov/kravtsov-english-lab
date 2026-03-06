import type { CardWithLexicalUnit } from '@/entities/card/model/card.types.ts';
import { useContextStore } from '@/features/vocabulary/card-practice/context/model/context.store.ts';
import { useListeningStore } from '@/features/vocabulary/card-practice/listening/model/listening.store.ts';
import type { PracticeMode } from '@/features/vocabulary/card-practice/model/practice-mode.types.ts';
import { useRecognitionStore } from '@/features/vocabulary/card-practice/recognition/model/recognition.store.ts';
import { useTypingStore } from '@/features/vocabulary/card-practice/typing/model/typing.store.ts';

type Params = {
  cardSetId?: string;
  items: CardWithLexicalUnit[];
  setMode: (mode: PracticeMode) => void;
  recognitionAvailable: boolean;
  typingAvailable: boolean;
  contextAvailable: boolean;
  listeningAvailable: boolean;
};

export function usePracticeModeActions({
  cardSetId,
  items,
  setMode,
  recognitionAvailable,
  typingAvailable,
  contextAvailable,
  listeningAvailable,
}: Params) {
  const startRecognition = useRecognitionStore((s) => s.start);
  const stopRecognition = useRecognitionStore((s) => s.stop);

  const startTyping = useTypingStore((s) => s.start);
  const stopTyping = useTypingStore((s) => s.stop);

  const startContext = useContextStore((s) => s.start);
  const stopContext = useContextStore((s) => s.stop);

  const startListening = useListeningStore((s) => s.start);
  const stopListening = useListeningStore((s) => s.stop);

  const stopAll = () => {
    stopRecognition();
    stopTyping();
    stopContext();
    stopListening();
  };

  const setStandardMode = () => {
    stopAll();
    setMode('standard');
  };

  const startRecognitionMode = () => {
    if (!cardSetId || !recognitionAvailable) return;

    stopTyping();
    stopContext();
    stopListening();
    startRecognition(cardSetId, items);
    setMode('recognition');
  };

  const startTypingMode = () => {
    if (!cardSetId || !typingAvailable) return;

    stopRecognition();
    stopContext();
    stopListening();
    startTyping(cardSetId, items);
    setMode('typing');
  };

  const startContextMode = () => {
    if (!cardSetId || !contextAvailable) return;

    stopRecognition();
    stopTyping();
    stopListening();
    startContext(cardSetId, items);
    setMode('context');
  };

  const startListeningMode = () => {
    if (!cardSetId || !listeningAvailable) return;

    stopRecognition();
    stopTyping();
    stopContext();
    startListening(cardSetId, items);
    setMode('listening');
  };

  return {
    setStandardMode,
    startRecognitionMode,
    startTypingMode,
    startContextMode,
    startListeningMode,
  };
}
