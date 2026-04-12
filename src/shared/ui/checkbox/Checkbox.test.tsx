import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import { Checkbox } from './Checkbox';
import style from './Checkbox.module.scss';

describe('Checkbox', () => {
  it('renders label text', () => {
    render(<Checkbox label="Accept terms" />);

    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('renders ReactNode label', () => {
    render(<Checkbox label={<span>Custom label</span>} />);

    expect(screen.getByText('Custom label')).toBeInTheDocument();
  });

  it('uses default size 24x24', () => {
    const { container } = render(<Checkbox label="Accept terms" />);

    const checkbox = container.querySelector(`.${style.checkbox}`);

    expect(checkbox).toHaveStyle({
      width: '24px',
      height: '24px',
    });
  });

  it('uses custom size', () => {
    const { container } = render(<Checkbox label="Accept terms" size={32} />);

    const checkbox = container.querySelector(`.${style.checkbox}`);

    expect(checkbox).toHaveStyle({
      width: '32px',
      height: '32px',
    });
  });

  it('renders unchecked state by default', () => {
    const { container } = render(<Checkbox label="Accept terms" />);

    const innerSquare = container.querySelector(`.${style.innerSquare}`);

    expect(innerSquare).not.toHaveClass(style.checked);
  });

  it('renders checked state when checked is true', () => {
    const { container } = render(<Checkbox label="Accept terms" checked={true} />);

    const innerSquare = container.querySelector(`.${style.innerSquare}`);

    expect(innerSquare).toHaveClass(style.checked);
  });

  it('renders checked state when checked is a non-empty string', () => {
    const { container } = render(<Checkbox label="Accept terms" checked="yes" />);

    const innerSquare = container.querySelector(`.${style.innerSquare}`);

    expect(innerSquare).toHaveClass(style.checked);
  });

  it('calls onChange with true when unchecked checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { container } = render(
      <Checkbox label="Accept terms" checked={false} onChange={onChange} />,
    );

    const checkbox = container.querySelector(`.${style.checkbox}`)!;

    await user.click(checkbox);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when checked checkbox is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { container } = render(
      <Checkbox label="Accept terms" checked={true} onChange={onChange} />,
    );

    const checkbox = container.querySelector(`.${style.checkbox}`)!;

    await user.click(checkbox);

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('calls onChange when label is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Checkbox label="Accept terms" checked={false} onChange={onChange} />);

    await user.click(screen.getByText('Accept terms'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('does not fail when onChange is not provided', async () => {
    const user = userEvent.setup();

    const { container } = render(<Checkbox label="Accept terms" checked={false} />);

    const checkbox = container.querySelector(`.${style.checkbox}`)!;

    await user.click(checkbox);

    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });
});