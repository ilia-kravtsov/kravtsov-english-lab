import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach,describe, expect, it, vi } from 'vitest';

import { readPracticeStats } from '@/features/vocabulary/card-practice/shared/model/practice.storage';

import { PracticeResults } from './PracticeResults';

vi.mock('@/features/vocabulary/card-practice/shared/model/practice.storage', () => ({
  readPracticeStats: vi.fn(),
}));

vi.mock('@/shared/ui/confetti-burst-petard/ConfettiBurstPetard', () => ({
  ConfettiBurstPetard: () => <div data-testid="confetti-burst-petard" />,
}));

describe('PracticeResults', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders results for all practice modes', () => {
    vi.mocked(readPracticeStats).mockReturnValue({
      recognition: {
        totalCards: 10,
        firstTryCorrectCards: 8,
        wrongAnswers: 3,
        skippedCards: 1,
        avgTimeMs: 420,
      },
      typing: {
        totalCards: 8,
        firstTryCorrectCards: 6,
        wrongAnswers: 2,
        skippedCards: 0,
        avgTimeMs: 510,
      },
      listening: {
        totalCards: 5,
        firstTryCorrectCards: 5,
        wrongAnswers: 0,
        skippedCards: 0,
        avgTimeMs: 390,
      },
      context: {
        totalCards: 4,
        firstTryCorrectCards: 2,
        wrongAnswers: 1,
        skippedCards: 2,
        avgTimeMs: 600,
      },
      standard: null,
    });

    render(
      <PracticeResults
        cardSetId="set-1"
        restart={vi.fn()}
        restartTitle="Restart Practice"
      />,
    );

    expect(readPracticeStats).toHaveBeenCalledWith('set-1');

    expect(screen.getByTestId('confetti-burst-petard')).toBeInTheDocument();
    expect(screen.getByText('Results')).toBeInTheDocument();

    expect(screen.getByText('Recognition')).toBeInTheDocument();
    expect(screen.getByText('Typing')).toBeInTheDocument();
    expect(screen.getByText('Listening')).toBeInTheDocument();
    expect(screen.getByText('Context')).toBeInTheDocument();

    expect(
      screen.getByText('first try 80% · 3 mistakes · 1 skip · avg 420ms'),
    ).toBeInTheDocument();

    expect(
      screen.getByText('first try 75% · 2 mistakes · avg 510ms'),
    ).toBeInTheDocument();

    expect(screen.getByText('first try 100% · avg 390ms')).toBeInTheDocument();

    expect(
      screen.getByText('first try 50% · 1 mistake · 2 skips · avg 600ms'),
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Restart Practice' }),
    ).toBeInTheDocument();
  });

  it('shows "Not started" for modes without stats', () => {
    vi.mocked(readPracticeStats).mockReturnValue({
      recognition: undefined,
      typing: null,
      listening: undefined,
      context: null,
      standard: null,
    });

    render(
      <PracticeResults
        cardSetId="set-1"
        restart={vi.fn()}
        restartTitle="Restart Practice"
      />,
    );

    const notStarted = screen.getAllByText('Not started');
    expect(notStarted).toHaveLength(4);
  });

  it('calls restart when restart button is clicked', async () => {
    const user = userEvent.setup();
    const restart = vi.fn();

    vi.mocked(readPracticeStats).mockReturnValue({
      recognition: undefined,
      typing: undefined,
      listening: undefined,
      context: undefined,
      standard: null,
    });

    render(
      <PracticeResults
        cardSetId="set-1"
        restart={restart}
        restartTitle="Restart Recognition"
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Restart Recognition' }));

    expect(restart).toHaveBeenCalledTimes(1);
  });
});