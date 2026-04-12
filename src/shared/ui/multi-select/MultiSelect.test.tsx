import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';

import type { PartsOfSpeech } from '@/entities/lexical-unit';
import { MultiSelect } from '@/shared/ui';

import style from './MultiSelect.module.scss';

type Option = { value: PartsOfSpeech; label: string };

const options: Option[] = [
  { value: 'noun', label: 'Noun' },
  { value: 'verb', label: 'Verb' },
  { value: 'adjective', label: 'Adjective' },
];

describe('MultiSelect', () => {
  it('renders placeholder when no values are selected', () => {
    render(
      <MultiSelect
        value={[]}
        onChange={vi.fn()}
        options={options}
        placeholder="Choose parts of speech"
      />,
    );

    expect(screen.getByText('Choose parts of speech')).toBeInTheDocument();
  });

  it('renders default placeholder when custom placeholder is not provided', () => {
    render(<MultiSelect value={[]} onChange={vi.fn()} options={options} />);

    expect(screen.getByText('Select...')).toBeInTheDocument();
  });

  it('opens dropdown on control click', async () => {
    const user = userEvent.setup();

    render(<MultiSelect value={[]} onChange={vi.fn()} options={options} />);

    const control = screen.getByRole('button');

    await user.click(control);

    expect(screen.getByText('Noun')).toBeInTheDocument();
    expect(screen.getByText('Verb')).toBeInTheDocument();
    expect(screen.getByText('Adjective')).toBeInTheDocument();
  });

  it('renders selected tags', () => {
    render(<MultiSelect value={['noun', 'verb']} onChange={vi.fn()} options={options} />);

    expect(screen.getByText('Noun')).toBeInTheDocument();
    expect(screen.getByText('Verb')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Noun' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Verb' })).toBeInTheDocument();
  });

  it('removes selected value when remove button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<MultiSelect value={['noun', 'verb']} onChange={onChange} options={options} />);

    await user.click(screen.getByRole('button', { name: 'Remove Verb' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(['noun']);
  });

  it('uses raw value as fallback label when option label is missing in map', () => {
    render(
      <MultiSelect
        value={['adverb']}
        onChange={vi.fn()}
        options={options}
      />,
    );

    expect(screen.getByText('adverb')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove adverb' })).toBeInTheDocument();
  });

  it('applies active option class for selected options in dropdown', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MultiSelect value={['verb']} onChange={vi.fn()} options={options} />,
    );

    const control = container.querySelector(`.${style.control}`);
    expect(control).toBeInTheDocument();

    await user.click(control as HTMLButtonElement);

    const activeOption = container.querySelector(`.${style.optionActive}`);

    expect(activeOption).toBeInTheDocument();
    expect(activeOption).toHaveTextContent('Verb');
  });

  it('closes dropdown on blur outside root', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <MultiSelect value={[]} onChange={vi.fn()} options={options} />
        <button type="button">Outside</button>
      </div>,
    );

    const control = container.querySelector(`.${style.control}`);
    const root = container.querySelector(`.${style.root}`);
    const outsideButton = screen.getByRole('button', { name: 'Outside' });

    expect(control).toBeInTheDocument();
    expect(root).toBeInTheDocument();

    await user.click(control as HTMLButtonElement);
    expect(screen.getByText('Noun')).toBeInTheDocument();

    fireEvent.blur(root as HTMLDivElement, {
      relatedTarget: outsideButton,
    });

    expect(screen.queryByText('Noun')).not.toBeInTheDocument();
  });

  it('does not open dropdown when disabled', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <MultiSelect value={[]} onChange={vi.fn()} options={options} disabled />,
    );

    await user.click(screen.getByRole('button'));

    expect(screen.queryByText('Noun')).not.toBeInTheDocument();
    expect(container.firstChild).toHaveClass(style.disabled);
  });

  it('does not call onChange when disabled and option is toggled', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<MultiSelect value={['noun']} onChange={onChange} options={options} disabled />);

    await user.click(screen.getByRole('button', { name: /Remove Noun/i }));

    expect(onChange).not.toHaveBeenCalled();
  });
});