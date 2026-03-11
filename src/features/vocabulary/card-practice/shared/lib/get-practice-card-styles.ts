import type { PracticeSwitchState } from '@/features/vocabulary/card-practice/model/practice-mode.types';
import type { TextInputFeedback } from '@/features/vocabulary/card-practice/shared/model/text-input-practice.types';

export function getPracticeCardClassName(
  style: CSSModuleClasses,
  switchAnim: CSSModuleClasses,
  switchDir: PracticeSwitchState | undefined,
  feedback: TextInputFeedback,
): string {
  return [
    style.card,
    switchDir === 'next' ? switchAnim.switchNext : '',
    switchDir === 'prev' ? switchAnim.switchPrev : '',
    feedback === 'correct' ? style.cardCorrect : '',
    feedback === 'wrong' ? style.cardWrong : '',
  ].join(' ');
}