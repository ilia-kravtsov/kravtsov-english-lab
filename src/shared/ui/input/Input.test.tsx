import { createRef } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Input } from './Input';
import style from './Input.module.scss';

describe('Input', () => {
  it('renders input element', () => {
    render(<Input />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies input class', () => {
    render(<Input />);

    expect(screen.getByRole('textbox')).toHaveClass(style.input);
  });

  it('forwards ref to input element', () => {
    const ref = createRef<HTMLInputElement>();

    render(<Input ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(screen.getByRole('textbox'));
  });

  it('passes placeholder prop', () => {
    render(<Input placeholder="Type here" />);

    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument();
  });

  it('passes value prop', () => {
    render(<Input value="hello" readOnly />);

    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Input onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), 'abc');

    expect(onChange).toHaveBeenCalled();
  });

  it('passes disabled prop', () => {
    render(<Input disabled />);

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('passes custom type prop', () => {
    render(<Input type="password" />);

    expect(screen.getByDisplayValue('')).toHaveAttribute('type', 'password');
  });
});