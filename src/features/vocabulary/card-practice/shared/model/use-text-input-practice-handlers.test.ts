import { renderHook } from '@testing-library/react';
import type { KeyboardEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';

import switchAnim from '@/features/vocabulary/card-practice/shared/ui/SwitchAnimation.module.scss';

import { useTextInputPracticeHandlers } from './use-text-input-practice-handlers';

const style = {
  card: 'card',
  cardCorrect: 'cardCorrect',
  cardWrong: 'cardWrong',
};

describe('useTextInputPracticeHandlers', () => {
  it('returns base card class', () => {
    const { result } = renderHook(() =>
      useTextInputPracticeHandlers({
        style,
        switchDir: undefined,
        feedback: 'idle',
        setInput: vi.fn(),
        submit: vi.fn(),
      }),
    );

    expect(result.current.cardStyles).toContain(style.card);
  });

  it('adds next switch animation class', () => {
    const { result } = renderHook(() =>
      useTextInputPracticeHandlers({
        style,
        switchDir: 'next',
        feedback: 'idle',
        setInput: vi.fn(),
        submit: vi.fn(),
      }),
    );

    expect(result.current.cardStyles).toContain(style.card);
    expect(result.current.cardStyles).toContain(switchAnim.switchNext);
  });

  it('adds prev switch animation class', () => {
    const { result } = renderHook(() =>
      useTextInputPracticeHandlers({
        style,
        switchDir: 'prev',
        feedback: 'idle',
        setInput: vi.fn(),
        submit: vi.fn(),
      }),
    );

    expect(result.current.cardStyles).toContain(style.card);
    expect(result.current.cardStyles).toContain(switchAnim.switchPrev);
  });

  it('adds correct feedback class', () => {
    const { result } = renderHook(() =>
      useTextInputPracticeHandlers({
        style,
        switchDir: undefined,
        feedback: 'correct',
        setInput: vi.fn(),
        submit: vi.fn(),
      }),
    );

    expect(result.current.cardStyles).toContain(style.card);
    expect(result.current.cardStyles).toContain(style.cardCorrect);
  });

  it('adds wrong feedback class', () => {
    const { result } = renderHook(() =>
      useTextInputPracticeHandlers({
        style,
        switchDir: undefined,
        feedback: 'wrong',
        setInput: vi.fn(),
        submit: vi.fn(),
      }),
    );

    expect(result.current.cardStyles).toContain(style.card);
    expect(result.current.cardStyles).toContain(style.cardWrong);
  });

  it('combines animation and feedback classes', () => {
    const { result } = renderHook(() =>
      useTextInputPracticeHandlers({
        style,
        switchDir: 'next',
        feedback: 'correct',
        setInput: vi.fn(),
        submit: vi.fn(),
      }),
    );

    expect(result.current.cardStyles).toContain(style.card);
    expect(result.current.cardStyles).toContain(switchAnim.switchNext);
    expect(result.current.cardStyles).toContain(style.cardCorrect);
  });

  it('calls setInput with input value on change', () => {
    const setInput = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeHandlers({
        style,
        switchDir: undefined,
        feedback: 'idle',
        setInput,
        submit: vi.fn(),
      }),
    );

    result.current.handleInputChange({
      target: { value: 'hello' },
    } as React.ChangeEvent<HTMLInputElement>);

    expect(setInput).toHaveBeenCalledTimes(1);
    expect(setInput).toHaveBeenCalledWith('hello');
  });

  it('prevents default and calls submit on Enter keydown', () => {
    const submit = vi.fn();
    const preventDefault = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeHandlers({
        style,
        switchDir: undefined,
        feedback: 'idle',
        setInput: vi.fn(),
        submit,
      }),
    );

    result.current.handleInputKeyDown({
      key: 'Enter',
      preventDefault,
    } as unknown as KeyboardEvent<HTMLInputElement>);

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('does not call submit for non-Enter keydown', () => {
    const submit = vi.fn();
    const preventDefault = vi.fn();

    const { result } = renderHook(() =>
      useTextInputPracticeHandlers({
        style,
        switchDir: undefined,
        feedback: 'idle',
        setInput: vi.fn(),
        submit,
      }),
    );

    result.current.handleInputKeyDown({
      key: 'Escape',
      preventDefault,
    } as unknown as KeyboardEvent<HTMLInputElement>);

    expect(preventDefault).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
  });
});