import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConfettiBurst } from './ConfettiBurst';
import style from './ConfettiBurst.module.scss';

describe('ConfettiBurst', () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders default number of pieces', async () => {
    const { container } = render(<ConfettiBurst />);

    const pieces = container.querySelectorAll(`.${style.piece}`);
    expect(pieces).toHaveLength(46);
  });

  it('renders custom number of pieces', () => {
    const { container } = render(<ConfettiBurst pieces={7} />);

    const pieces = container.querySelectorAll(`.${style.piece}`);
    expect(pieces).toHaveLength(7);
  });

  it('renders wrap while active', () => {
    const { container } = render(<ConfettiBurst pieces={3} />);

    const wrap = container.querySelector(`.${style.wrap}`);
    expect(wrap).toBeInTheDocument();
  });

  it('hides burst after maxDurationMs', () => {
    vi.useFakeTimers();

    const { container } = render(<ConfettiBurst pieces={4} maxDurationMs={500} />);

    expect(container.querySelector(`.${style.wrap}`)).toBeInTheDocument();
    expect(container.querySelectorAll(`.${style.piece}`)).toHaveLength(4);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(container.querySelector(`.${style.wrap}`)).not.toBeInTheDocument();
    expect(container.querySelectorAll(`.${style.piece}`)).toHaveLength(0);
  });

  it('stays visible before maxDurationMs expires', () => {
    vi.useFakeTimers();

    const { container } = render(<ConfettiBurst pieces={5} maxDurationMs={1000} />);

    act(() => {
      vi.advanceTimersByTime(999);
    });

    expect(container.querySelector(`.${style.wrap}`)).toBeInTheDocument();
    expect(container.querySelectorAll(`.${style.piece}`)).toHaveLength(5);
  });

  it('applies generated inline styles to pieces', () => {
    const { container } = render(<ConfettiBurst pieces={1} />);

    const piece = container.querySelector(`.${style.piece}`) as HTMLElement;

    expect(piece).toBeInTheDocument();
    expect(piece.style.left).not.toBe('');
    expect(piece.style.animationDelay).not.toBe('');
    expect(piece.style.animationDuration).not.toBe('');
    expect(piece.style.transform).toContain('translateX(-50%)');
    expect(piece.style.width).not.toBe('');
    expect(piece.style.height).not.toBe('');
    expect(piece.style.backgroundColor).not.toBe('');
  });

  it('regenerates pieces when pieces prop changes', () => {
    const { container, rerender } = render(<ConfettiBurst pieces={2} />);

    expect(container.querySelectorAll(`.${style.piece}`)).toHaveLength(2);

    rerender(<ConfettiBurst pieces={6} />);

    expect(container.querySelectorAll(`.${style.piece}`)).toHaveLength(6);
  });

  it('cleans up correctly after unmount', () => {
    const { container, unmount } = render(<ConfettiBurst pieces={3} />);

    expect(container.querySelector(`.${style.wrap}`)).toBeInTheDocument();

    unmount();

    expect(container.querySelector(`.${style.wrap}`)).not.toBeInTheDocument();
  });
});