import type { Dispatch, SetStateAction } from 'react';

import type { CardWithLexicalUnit } from '@/entities/card';
import type {
  PracticeSwitchDir,
  PracticeSwitchState,
} from '@/features/vocabulary/card-practice/shared';

export type Params = {
  items: CardWithLexicalUnit[];
  index: number;
  isFlipped: boolean;
  setIsFlipped: Dispatch<SetStateAction<boolean>>;
  setIndex: Dispatch<SetStateAction<number>>;
  switchDir: PracticeSwitchState | undefined;
  triggerSwitch: (dir: PracticeSwitchDir) => void;
};