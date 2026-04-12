import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, it } from 'vitest';

import type { PracticeSwitchState } from '@/features/vocabulary/card-practice/shared';
import { baseCards } from '@/shared/test/fixtures/cards.fixture';
import { setupPracticeStoreTest } from '@/shared/test/utils/practice-test.utils';

import { useRecognitionStore } from '../model/recognition.store';
import { RecognitionPractice } from './RecognitionPractice';
import style from './RecognitionPractice.module.scss';

function RecognitionPracticeTestBed() {
  const [switchDir, setSwitchDir] = useState<PracticeSwitchState>(null);

  const handleAutoNext = () => {
    setSwitchDir('next');

    window.setTimeout(() => {
      act(() => {
        useRecognitionStore.getState().next();
      });

      setSwitchDir(null);
    }, 0);
  };

  return (
    <RecognitionPractice
      switchDir={switchDir}
      onAutoNext={handleAutoNext}
      autoNextCommitDelayMs={130}
    />
  );
}

function renderRecognitionPractice() {
  act(() => {
    useRecognitionStore.getState().start('set-1', baseCards);
  });

  return render(<RecognitionPracticeTestBed />);
}

describe('RecognitionPractice integration', () => {
  setupPracticeStoreTest(useRecognitionStore);

  it('renders current card and answer options', () => {
    renderRecognitionPractice();

    expect(screen.getByText('hello')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'привет' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'мир' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'кот' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'солнце' })).toBeInTheDocument();

    expect(screen.getByText('Attempts: 0')).toBeInTheDocument();
    expect(screen.getByText('1 / 4')).toBeInTheDocument();
  });

  it('marks wrong answer and disables wrong option', async () => {
    const user = userEvent.setup();

    renderRecognitionPractice();

    const wrongOption = screen.getByRole('button', { name: 'мир' });

    await user.click(wrongOption);

    await waitFor(() => {
      expect(screen.getByText('Attempts: 1')).toBeInTheDocument();
      expect(wrongOption).toBeDisabled();
    });

    expect(wrongOption).toHaveClass(style.optionWrong);
  });
});