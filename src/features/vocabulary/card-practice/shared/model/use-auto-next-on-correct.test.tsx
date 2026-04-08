import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAutoNextOnCorrect } from './use-auto-next-on-correct';

type TestHarnessProps = {
  enabled?: boolean;
  isFinished: boolean;
  locked: boolean;
  feedback: string | null;
  next: () => void;
  delayMs?: number;
  beforeNext?: () => void;
  commitDelayMs?: number;
};

function TestHarness(props: TestHarnessProps) {
  useAutoNextOnCorrect(props);
  return null;
}

describe('useAutoNextOnCorrect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('calls next after delay when state is correct and locked', () => {
    const next = vi.fn();

    render(
      <TestHarness
        isFinished={false}
        locked={true}
        feedback="correct"
        next={next}
        delayMs={500}
      />,
    );

    expect(next).not.toHaveBeenCalled();

    vi.advanceTimersByTime(499);
    expect(next).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('does not call next when disabled', () => {
    const next = vi.fn();

    render(
      <TestHarness
        enabled={false}
        isFinished={false}
        locked={true}
        feedback="correct"
        next={next}
        delayMs={500}
      />,
    );

    vi.advanceTimersByTime(500);

    expect(next).not.toHaveBeenCalled();
  });

  it('does not call next when practice is finished', () => {
    const next = vi.fn();

    render(
      <TestHarness isFinished={true} locked={true} feedback="correct" next={next} delayMs={500} />,
    );

    vi.advanceTimersByTime(500);

    expect(next).not.toHaveBeenCalled();
  });

  it('does not call next when not locked', () => {
    const next = vi.fn();

    render(
      <TestHarness
        isFinished={false}
        locked={false}
        feedback="correct"
        next={next}
        delayMs={500}
      />,
    );

    vi.advanceTimersByTime(500);

    expect(next).not.toHaveBeenCalled();
  });

  it('does not call next when feedback is not correct', () => {
    const next = vi.fn();

    render(
      <TestHarness isFinished={false} locked={true} feedback="wrong" next={next} delayMs={500} />,
    );

    vi.advanceTimersByTime(500);

    expect(next).not.toHaveBeenCalled();
  });

  it('calls beforeNext before next', () => {
    const next = vi.fn();
    const beforeNext = vi.fn();

    render(
      <TestHarness
        isFinished={false}
        locked={true}
        feedback="correct"
        next={next}
        beforeNext={beforeNext}
        delayMs={500}
      />,
    );

    vi.advanceTimersByTime(500);

    expect(beforeNext).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(beforeNext.mock.invocationCallOrder[0]).toBeLessThan(next.mock.invocationCallOrder[0]);
  });

  it('respects commitDelayMs and delays next after beforeNext', () => {
    const next = vi.fn();
    const beforeNext = vi.fn();

    render(
      <TestHarness
        isFinished={false}
        locked={true}
        feedback="correct"
        next={next}
        beforeNext={beforeNext}
        delayMs={500}
        commitDelayMs={200}
      />,
    );

    vi.advanceTimersByTime(500);

    expect(beforeNext).toHaveBeenCalledTimes(1);
    expect(next).not.toHaveBeenCalled();

    vi.advanceTimersByTime(199);
    expect(next).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('clears scheduled timeout on unmount', () => {
    const next = vi.fn();

    const clearTimeoutSpy = vi.spyOn(window, 'clearTimeout');

    const { unmount } = render(
      <TestHarness isFinished={false} locked={true} feedback="correct" next={next} delayMs={500} />,
    );

    unmount();

    expect(clearTimeoutSpy).toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(next).not.toHaveBeenCalled();
  });

  it('clears previous timeout when dependencies change', () => {
    const next = vi.fn();

    const { rerender } = render(
      <TestHarness isFinished={false} locked={true} feedback="correct" next={next} delayMs={500} />,
    );

    vi.advanceTimersByTime(300);

    rerender(
      <TestHarness isFinished={false} locked={true} feedback="wrong" next={next} delayMs={500} />,
    );

    vi.advanceTimersByTime(500);

    expect(next).not.toHaveBeenCalled();
  });
});
