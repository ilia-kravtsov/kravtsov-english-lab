import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { BurgerButton } from '@/shared/ui';

import style from './BurgerButton.module.scss';

describe('BurgerButton', () => {
  it('renders button with aria-label', () => {
    render(<BurgerButton isOpen={false} toggleBurger={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Toggle menu' })).toBeInTheDocument();
  });

  it('renders closed state class when isOpen is false', () => {
    render(<BurgerButton isOpen={false} toggleBurger={vi.fn()} />);

    const button = screen.getByRole('button', { name: 'Toggle menu' });

    expect(button).toHaveClass(style.burger);
    expect(button).not.toHaveClass(style.open);
  });

  it('renders open state class when isOpen is true', () => {
    render(<BurgerButton isOpen={true} toggleBurger={vi.fn()} />);

    const button = screen.getByRole('button', { name: 'Toggle menu' });

    expect(button).toHaveClass(style.burger);
    expect(button).toHaveClass(style.open);
  });

  it('calls toggleBurger with true when button is closed and clicked', async () => {
    const user = userEvent.setup();
    const toggleBurger = vi.fn();

    render(<BurgerButton isOpen={false} toggleBurger={toggleBurger} />);

    await user.click(screen.getByRole('button', { name: 'Toggle menu' }));

    expect(toggleBurger).toHaveBeenCalledTimes(1);
    expect(toggleBurger).toHaveBeenCalledWith(true);
  });

  it('calls toggleBurger with false when button is open and clicked', async () => {
    const user = userEvent.setup();
    const toggleBurger = vi.fn();

    render(<BurgerButton isOpen={true} toggleBurger={toggleBurger} />);

    await user.click(screen.getByRole('button', { name: 'Toggle menu' }));

    expect(toggleBurger).toHaveBeenCalledTimes(1);
    expect(toggleBurger).toHaveBeenCalledWith(false);
  });

  it('forwards ref to button element', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<BurgerButton isOpen={false} toggleBurger={vi.fn()} ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Toggle menu' }));
  });

  it('renders three burger lines', () => {
    const { container } = render(<BurgerButton isOpen={false} toggleBurger={vi.fn()} />);

    const lines = container.querySelectorAll(`.${style.burgerLine}`);

    expect(lines).toHaveLength(3);
  });
});