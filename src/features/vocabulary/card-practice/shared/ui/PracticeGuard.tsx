import { type JSX, type ReactNode } from 'react';

import { PracticeResults } from '@/features/vocabulary/card-practice/shared/ui/practice-results/PracticeResults.tsx';

type Props = {
  cardSetId: string | null;
  isFinished: boolean;
  restart: () => void;
  restartTitle: string;
  isReady: boolean;
  children: ReactNode;
};

export function PracticeGuard({
  cardSetId,
  isFinished,
  restart,
  restartTitle,
  isReady,
  children,
}: Props): JSX.Element | null {
  if (!cardSetId) return null;

  if (isFinished) {
    return <PracticeResults cardSetId={cardSetId} restart={restart} restartTitle={restartTitle} />;
  }

  if (!isReady) return null;

  return <>{children}</>;
}
