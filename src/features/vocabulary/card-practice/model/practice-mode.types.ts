export type PracticeMode =
  | 'standard'
  | 'recognition'
  | 'typing'
  | 'listening'
  | 'context';

export type PracticeSwitchDir = 'next' | 'prev';
export type PracticeSwitchState = PracticeSwitchDir | null;