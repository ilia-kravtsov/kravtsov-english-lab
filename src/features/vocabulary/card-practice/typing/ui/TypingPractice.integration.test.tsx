import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { CardWithLexicalUnit } from '@/entities/card';
import type { LexicalUnitType } from '@/entities/lexical-unit';

import { useTypingStore } from '../model/typing.store';
import { TypingPractice } from './TypingPractice';
import style from './TypingPractice.module.scss';

const WORD_TYPE = 'word' as LexicalUnitType;

const cards: CardWithLexicalUnit[] = [
  {
    id: 'card-1',
    cardSetId: 'set-1',
    lexicalUnitId: 'lu-1',
    note: null,
    sortOrder: 0,
    createdAt: '2026-04-08T00:00:00.000Z',
    updatedAt: '2026-04-08T00:00:00.000Z',
    lexicalUnit: {
      id: 'lu-1',
      type: WORD_TYPE,
      value: 'hello',
      translation: 'привет',
      meaning: 'a greeting',
    },
  },
  {
    id: 'card-2',
    cardSetId: 'set-1',
    lexicalUnitId: 'lu-2',
    note: null,
    sortOrder: 1,
    createdAt: '2026-04-08T00:00:00.000Z',
    updatedAt: '2026-04-08T00:00:00.000Z',
    lexicalUnit: {
      id: 'lu-2',
      type: WORD_TYPE,
      value: 'world',
      translation: 'мир',
      meaning: 'the earth and all people',
    },
  },
];

function renderTypingPractice() {
  act(() => {
    useTypingStore.getState().start('set-1', cards);
  });

  return render(<TypingPractice />);
}

describe('TypingPractice integration', () => {
  beforeEach(() => {
    useTypingStore.getState().stop();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    useTypingStore.getState().stop();
  });

  it('renders the active card', async () => {
    renderTypingPractice();

    expect(screen.getByText('Translate:')).toBeInTheDocument();
    expect(screen.getByText('привет')).toBeInTheDocument();
    expect(screen.getByText('Meaning in English')).toBeInTheDocument();
    expect(screen.getByText('a greeting')).toBeInTheDocument();

    expect(screen.queryByText('мир')).not.toBeInTheDocument();

    expect(screen.getByPlaceholderText('Type lexical unit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Skip' })).toBeInTheDocument();

    expect(screen.getByText('Attempts: 0')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();
  });

  it('accepts a correct answer for the active card', async () => {
    const user = userEvent.setup();

    renderTypingPractice();

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
  });

  it('shows correct feedback after the correct answer', async () => {
    const user = userEvent.setup();
    const { container } = renderTypingPractice();

    const input = screen.getByPlaceholderText('Type lexical unit');
    const checkButton = screen.getByRole('button', { name: 'Check' });

    await user.type(input, 'hello');
    await user.click(checkButton);

    await waitFor(() => {
      expect(input).toBeDisabled();
    });

    const card = container.querySelector(`.${style.card}`);

    expect(card).not.toBeNull();
    expect(card).toHaveClass(style.cardCorrect);
    expect(card).not.toHaveClass(style.cardWrong);
  });

  it('moves to the next card after the correct answer',
    async () => {
      const user = userEvent.setup();

      renderTypingPractice();

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
      expect(screen.getByText('the earth and all people')).toBeInTheDocument();

      expect(nextInput).toHaveValue('');
      expect(nextInput).not.toBeDisabled();

      expect(screen.getByText('Attempts: 0')).toBeInTheDocument();
      expect(screen.getByText('2 / 2')).toBeInTheDocument();
    },
    10000,
  );
});