import type { PracticeSwitchState } from '@/features/vocabulary/card-practice/model/practice-mode.types.ts';

export type PracticeViewProps = {
  switchDir?: PracticeSwitchState;
  onAutoNext?: () => void;
  autoNextCommitDelayMs?: number;
};