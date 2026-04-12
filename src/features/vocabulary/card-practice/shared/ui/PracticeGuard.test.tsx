import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PracticeGuard } from './PracticeGuard';

vi.mock('@/features/vocabulary/card-practice/shared/ui/practice-results/PracticeResults.tsx', () => ({
  PracticeResults: ({
                      cardSetId,
                      restartTitle,
                    }: {
    cardSetId: string;
    restart: () => void;
    restartTitle: string;
  }) => (
    <div data-testid="practice-results">
      <span>{cardSetId}</span>
      <span>{restartTitle}</span>
    </div>
  ),
}));

describe('PracticeGuard', () => {
  it('returns null when cardSetId is missing', () => {
    const { container } = render(
      <PracticeGuard
        cardSetId={null}
        isFinished={false}
        restart={vi.fn()}
        restartTitle="Restart Practice"
        isReady={true}
      >
        <div>Practice Content</div>
      </PracticeGuard>,
    );

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText('Practice Content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('practice-results')).not.toBeInTheDocument();
  });

  it('renders PracticeResults when practice is finished', () => {
    render(
      <PracticeGuard
        cardSetId="set-1"
        isFinished={true}
        restart={vi.fn()}
        restartTitle="Restart Typing"
        isReady={true}
      >
        <div>Practice Content</div>
      </PracticeGuard>,
    );

    expect(screen.getByTestId('practice-results')).toBeInTheDocument();
    expect(screen.getByText('set-1')).toBeInTheDocument();
    expect(screen.getByText('Restart Typing')).toBeInTheDocument();

    expect(screen.queryByText('Practice Content')).not.toBeInTheDocument();
  });

  it('returns null when practice is not ready', () => {
    const { container } = render(
      <PracticeGuard
        cardSetId="set-1"
        isFinished={false}
        restart={vi.fn()}
        restartTitle="Restart Practice"
        isReady={false}
      >
        <div>Practice Content</div>
      </PracticeGuard>,
    );

    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByText('Practice Content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('practice-results')).not.toBeInTheDocument();
  });

  it('renders children when cardSetId exists, practice is not finished and is ready', () => {
    render(
      <PracticeGuard
        cardSetId="set-1"
        isFinished={false}
        restart={vi.fn()}
        restartTitle="Restart Practice"
        isReady={true}
      >
        <div>Practice Content</div>
      </PracticeGuard>,
    );

    expect(screen.getByText('Practice Content')).toBeInTheDocument();
    expect(screen.queryByTestId('practice-results')).not.toBeInTheDocument();
  });
});