import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Button } from './Button';
import style from './Button.module.scss';

describe('Button', () => {
  it('renders button title', () => {
    render(<Button title="Save" />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders default type as button', () => {
    render(<Button title="Save" />);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
  });

  it('renders submit type when provided', () => {
    render(<Button title="Submit" type="submit" />);

    expect(screen.getByRole('button', { name: 'Submit' })).toHaveAttribute('type', 'submit');
  });

  it('renders disabled state when disabled is true', () => {
    render(<Button title="Save" disabled={true} />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('renders enabled state by default', () => {
    render(<Button title="Save" />);

    expect(screen.getByRole('button', { name: 'Save' })).toBeEnabled();
  });

  it('applies button class', () => {
    render(<Button title="Save" />);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(style.button);
  });

  it('applies external inline styles', () => {
    render(<Button title="Save" style={{ width: '120px', fontSize: '18px' }} />);

    expect(screen.getByRole('button', { name: 'Save' })).toHaveStyle({
      width: '120px',
      fontSize: '18px',
    });
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button title="Save" onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button title="Save" onClick={onClick} disabled={true} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(onClick).not.toHaveBeenCalled();
  });

  it('does not fail when onClick is not provided', async () => {
    const user = userEvent.setup();

    render(<Button title="Save" />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });
});