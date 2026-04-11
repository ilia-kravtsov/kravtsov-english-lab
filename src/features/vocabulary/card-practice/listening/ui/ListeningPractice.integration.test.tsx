import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { listeningCards } from '@/shared/test/fixtures/cards.fixture.ts';

import { useListeningStore } from '../model/listening.store';
import { ListeningPractice } from './ListeningPractice';
import style from './ListeningPractice.module.scss';

const playMock = vi.fn().mockResolvedValue(undefined);
const pauseMock = vi.fn();

function renderListeningPractice() {
  act(() => {
    useListeningStore.getState().start('set-1', listeningCards);
  });

  return render(<ListeningPractice />);
}

describe('ListeningPractice integration', () => {
  beforeEach(() => {
    useListeningStore.getState().stop();

    playMock.mockClear();
    pauseMock.mockClear();

    Object.defineProperty(HTMLMediaElement.prototype, 'play', {
      configurable: true,
      writable: true,
      value: playMock,
    });

    Object.defineProperty(HTMLMediaElement.prototype, 'pause', {
      configurable: true,
      writable: true,
      value: pauseMock,
    });
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    useListeningStore.getState().stop();
  });

  it('renders listening mode for the active audio card', () => {
    const { container } = renderListeningPractice();

    expect(screen.getByText('Listen and type:')).toBeInTheDocument();
    expect(screen.getByText('Hint')).toBeInTheDocument();
    expect(screen.getByText('привет')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Play' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Play' })).toBeEnabled();

    expect(screen.getByPlaceholderText('Type lexical unit')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Check' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Skip' })).toBeInTheDocument();

    expect(screen.getByText('Attempts: 0')).toBeInTheDocument();
    expect(screen.getByText('1 / 2')).toBeInTheDocument();

    const audio = container.querySelector('audio');

    expect(audio).not.toBeNull();
    expect(audio).toHaveAttribute('src', 'https://example.com/audio/hello.mp3');
  });

  it('accepts a correct answer for the active audio card', async () => {
    const user = userEvent.setup();
    const { container } = renderListeningPractice();

    const input = screen.getByPlaceholderText('Type lexical unit');
    const checkButton = screen.getByRole('button', { name: 'Check' });
    const playButton = screen.getByRole('button', { name: 'Play' });

    await user.click(playButton);

    expect(playMock).toHaveBeenCalledTimes(1);

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

    renderListeningPractice();

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

    expect(screen.getByRole('button', { name: 'Play' })).toBeEnabled();
  }, 10000);
});