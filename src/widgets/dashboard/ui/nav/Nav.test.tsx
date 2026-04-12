import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type MouseEventHandler, type ReactNode } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Nav } from './Nav';
import style from './Nav.module.scss';

const linkMock = vi.fn();

type LinkAsButtonProps = {
  to: string;
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

vi.mock('@/shared/ui/link-as-button/LinkAsButton', () => ({
  LinkAsButton: ({ to, children, onClick }: LinkAsButtonProps) => {
    linkMock({ to, children, onClick });

    return (
      <a data-testid={`nav-link-${to}`} href={to} onClick={onClick}>
        {children}
      </a>
    );
  },
}));

describe('Nav', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders navigation links', () => {
    render(<Nav isOpen={true} onLinkClick={vi.fn()} />);

    expect(screen.getAllByRole('link').length).toBeGreaterThan(0);
  });

  it('renders expanded state when isOpen is true', () => {
    const { container } = render(<Nav isOpen={true} onLinkClick={vi.fn()} />);

    const aside = container.querySelector('aside');

    expect(aside).toHaveClass(style.container);
    expect(aside).not.toHaveClass(style.collapsed);
  });

  it('renders collapsed state when isOpen is false', () => {
    const { container } = render(<Nav isOpen={false} onLinkClick={vi.fn()} />);

    const aside = container.querySelector('aside');

    expect(aside).toHaveClass(style.container);
    expect(aside).toHaveClass(style.collapsed);
  });

  it('calls onLinkClick when a navigation link is clicked', async () => {
    const user = userEvent.setup();
    const onLinkClick = vi.fn();

    render(<Nav isOpen={true} onLinkClick={onLinkClick} />);

    const firstLink = screen.getAllByRole('link')[0];
    await user.click(firstLink);

    expect(onLinkClick).toHaveBeenCalledTimes(1);
  });

  it('passes onClick handler to every link', () => {
    render(<Nav isOpen={true} onLinkClick={vi.fn()} />);

    expect(linkMock).toHaveBeenCalled();
    for (const call of linkMock.mock.calls) {
      expect(call[0]).toEqual(
        expect.objectContaining({
          to: expect.any(String),
          children: expect.anything(),
          onClick: expect.any(Function),
        }),
      );
    }
  });
});