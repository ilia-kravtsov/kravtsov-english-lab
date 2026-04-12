import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';

import { Footer } from './Footer';

const linkMock = vi.fn();

vi.mock('@/shared/ui/link-as-button/LinkAsButton', () => ({
  LinkAsButton: ({ to, children }: { to: string; children: ReactNode }) => {
    linkMock({ to, children });

    return (
      <a data-testid={`link-${to}`} href={to}>
        {children}
      </a>
    );
  },
}));

vi.mock('@/features/auth/logout-button', () => ({
  LogoutButton: () => <button data-testid="logout">Logout</button>,
}));

describe('Footer', () => {
  it('renders navigation links', () => {
    render(<Footer />);

    expect(screen.getByTestId('link-about')).toBeInTheDocument();
    expect(screen.getByTestId('link-contacts')).toBeInTheDocument();
  });

  it('renders correct link titles', () => {
    render(<Footer />);

    expect(screen.getByText('Author')).toBeInTheDocument();
    expect(screen.getByText('Contacts')).toBeInTheDocument();
  });

  it('passes correct props to LinkAsButton', () => {
    render(<Footer />);

    expect(linkMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'about', children: 'Author' }),
    );

    expect(linkMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'contacts', children: 'Contacts' }),
    );
  });

  it('renders correct number of links', () => {
    render(<Footer />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
  });
});