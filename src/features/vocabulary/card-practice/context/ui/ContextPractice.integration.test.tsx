import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { contextCards } from '@/shared/test/fixtures/cards.fixture';
import { setupPracticeStoreTest } from '@/shared/test/utils/practice-test.utils';

import { useContextStore } from '../model/context.store';
import { ContextPractice } from './ContextPractice';
import style from './ContextPractice.module.scss';

function renderContextPractice() {
  act(() => {
    useContextStore.getState().start('set-1', contextCards);
  });

  return render(<ContextPractice />);
}

describe('ContextPractice integration', () => {
  setupPracticeStoreTest(useContextStore);

  it('renders masked example for the active card', () => {
    renderContextPractice();

    expect(screen.getByText('Fill the gap:')).toBeInTheDocument();
    expect(screen.getByText('Hint')).toBeInTheDocument();
    expect(screen.getByText('привет')).toBeInTheDocument();

    expect(screen.getByPlaceholderText('Type lexical unit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Skip' })).toBeInTheDocument();

    expect(screen.getByText(/I say/i)).toBeInTheDocument();
    expect(screen.getByText(/to my friend every day/i)).toBeInTheDocument();
    expect(screen.queryByText('I say hello to my friend every day.')).not.toBeInTheDocument();

    expect(screen.getByText('Attempts: 0')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('accepts a correct answer for the active card', async () => {
    const user = userEvent.setup();
    const { container } = renderContextPractice();

    const input = screen.getByPlaceholderText('Type lexical unit');
    const checkButton = screen.getByRole('button', { name: 'Check' });

    await user.type(input, 'hello');
    expect(input).toHaveValue('hello');

    await user.click(checkButton);

    await waitFor(() => {
      expect(input).toBeDisabled();
    });

    expect(screen.getByText('Attempts: 1')).toBeInTheDocument();
    expect(checkButton).toBeDisabled();

    const card = container.querySelector(`.${style.card}`);

    expect(card).not.toBeNull();
    expect(card).toHaveClass(style.cardCorrect);
    expect(card).not.toHaveClass(style.cardWrong);
  });

  it('moves to the next card after correct answer', async () => {
    const user = userEvent.setup();

    renderContextPractice();

    const input = screen.getByPlaceholderText('Type lexical unit');
    const checkButton = screen.getByRole('button', { name: 'Check' });

    await user.type(input, 'hello');
    await user.click(checkButton);

    await waitFor(() => {
      expect(input).toBeDisabled();
      expect(screen.getByText('Attempts: 1')).toBeInTheDocument();
    });

    await waitFor(
      () => {
        expect(screen.getByText('мир')).toBeInTheDocument();
      },
      { timeout: 1500 },
    );

    const nextInput = screen.getByPlaceholderText('Type lexical unit');

    expect(screen.queryByText('привет')).not.toBeInTheDocument();
    expect(screen.getByText('2 / 2')).toBeInTheDocument();
    expect(screen.getByText('Attempts: 0')).toBeInTheDocument();

    expect(nextInput).toHaveValue('');
    expect(nextInput).not.toBeDisabled();

    expect(screen.getByText('The _____ is changing very quickly.')).toBeInTheDocument();
    expect(screen.queryByText('The world is changing very quickly.')).not.toBeInTheDocument();
  }, 10000);
});