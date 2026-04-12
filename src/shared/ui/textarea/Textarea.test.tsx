import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Textarea } from './Textarea';
import style from './Textarea.module.scss';

describe('Textarea', () => {
  it('renders textarea element', () => {
    render(<Textarea />);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('applies base class', () => {
    render(<Textarea />);

    expect(screen.getByRole('textbox')).toHaveClass(style.container);
  });

  it('applies custom className', () => {
    render(<Textarea className="custom-textarea" />);

    expect(screen.getByRole('textbox')).toHaveClass(style.container);
    expect(screen.getByRole('textbox')).toHaveClass('custom-textarea');
  });

  it('forwards ref to textarea element', () => {
    const ref = createRef<HTMLTextAreaElement>();

    render(<Textarea ref={ref} />);

    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
    expect(ref.current).toBe(screen.getByRole('textbox'));
  });

  it('passes placeholder prop', () => {
    render(<Textarea placeholder="Type your message" />);

    expect(screen.getByPlaceholderText('Type your message')).toBeInTheDocument();
  });

  it('passes value prop', () => {
    render(<Textarea value="hello world" readOnly />);

    expect(screen.getByRole('textbox')).toHaveValue('hello world');
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Textarea onChange={onChange} />);

    await user.type(screen.getByRole('textbox'), 'abc');

    expect(onChange).toHaveBeenCalled();
  });

  it('passes disabled prop', () => {
    render(<Textarea disabled />);

    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('passes rows prop', () => {
    render(<Textarea rows={5} />);

    expect(screen.getByRole('textbox')).toHaveAttribute('rows', '5');
  });
});