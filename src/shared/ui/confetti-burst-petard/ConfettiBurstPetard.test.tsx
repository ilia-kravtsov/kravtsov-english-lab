import { render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ConfettiBurstPetard } from '@/shared/ui';

import style from './ConfettiBurstPetard.module.scss';

describe('ConfettiBurstPetard', () => {
  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  it('renders confetti pieces into document.body portal', () => {
    render(<ConfettiBurstPetard pieces={5} maxDurationMs={2200} />);

    const wrap = document.body.querySelector(`.${style.wrap}`);
    const origin = document.body.querySelector(`.${style.origin}`);
    const pieces = document.body.querySelectorAll(`.${style.piece}`);

    expect(wrap).toBeInTheDocument();
    expect(origin).toBeInTheDocument();
    expect(pieces).toHaveLength(5);
  });

  it('renders default number of pieces when pieces prop is not provided', () => {
    render(<ConfettiBurstPetard />);

    const pieces = document.body.querySelectorAll(`.${style.piece}`);

    expect(pieces).toHaveLength(70);
  });

  it('keeps confetti visible before maxDurationMs expires', () => {
    vi.useFakeTimers();

    render(<ConfettiBurstPetard pieces={4} maxDurationMs={1000} />);

    vi.advanceTimersByTime(999);

    expect(document.body.querySelector(`.${style.wrap}`)).toBeInTheDocument();
    expect(document.body.querySelectorAll(`.${style.piece}`)).toHaveLength(4);
  });

  it('applies generated inline styles to confetti pieces', () => {
    render(<ConfettiBurstPetard pieces={1} />);

    const piece = document.body.querySelector(`.${style.piece}`) as HTMLElement;

    expect(piece).toBeInTheDocument();
    expect(piece.style.width).not.toBe('');
    expect(piece.style.height).not.toBe('');
    expect(piece.style.backgroundColor).not.toBe('');
    expect(piece.style.animationDelay).not.toBe('');
    expect(piece.style.animationDuration).not.toBe('');
    expect(piece.style.getPropertyValue('--dx')).not.toBe('');
    expect(piece.style.getPropertyValue('--dy')).not.toBe('');
    expect(piece.style.getPropertyValue('--rot')).not.toBe('');
    expect(piece.style.getPropertyValue('--rot2')).not.toBe('');
  });

  it('marks portal content as aria-hidden', () => {
    render(<ConfettiBurstPetard pieces={2} />);

    const wrap = document.body.querySelector(`.${style.wrap}`);

    expect(wrap).toHaveAttribute('aria-hidden');
  });

  it('cleans up correctly after unmount', () => {
    const { unmount } = render(<ConfettiBurstPetard pieces={6} maxDurationMs={2000} />);

    expect(document.body.querySelectorAll(`.${style.piece}`)).toHaveLength(6);

    unmount();

    expect(document.body.querySelector(`.${style.wrap}`)).not.toBeInTheDocument();
    expect(document.body.querySelectorAll(`.${style.piece}`)).toHaveLength(0);
  });
});