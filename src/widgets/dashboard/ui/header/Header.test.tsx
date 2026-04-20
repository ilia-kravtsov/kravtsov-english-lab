import { render, screen } from '@testing-library/react';
import type { ReactNode, RefObject } from 'react';
import { beforeEach,describe, expect, it, vi } from 'vitest';

import { Header } from './Header';

const useMatchesMock = vi.fn();
const useLocationMock = vi.fn();
const linkMock = vi.fn();
const mockProps = {
  onToggleMenu: vi.fn(),
  isMenuOpen: false,
  burgerRef: { current: null } as RefObject<HTMLButtonElement | null>,
};

vi.mock('react-router-dom', () => ({
  useMatches: () => useMatchesMock(),
  useLocation: () => useLocationMock(),
}));

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

vi.mock('@/shared/ui/page-home-link/PageHomeLink', () => ({
  PageHomeLink: () => <a data-testid="home-link" href="/">Home</a>,
}));

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('does not render PageHomeLink on home page', () => {
    useLocationMock.mockReturnValue({ pathname: '/' });
    useMatchesMock.mockReturnValue([]);

    render(<Header {...mockProps} />);

    expect(screen.queryByTestId('home-link')).not.toBeInTheDocument();
  });

  it('renders PageHomeLink on non-home page', () => {
    useLocationMock.mockReturnValue({ pathname: '/profile' });
    useMatchesMock.mockReturnValue([]);

    render(<Header {...mockProps} />);

    expect(screen.getByTestId('home-link')).toBeInTheDocument();
  });

  it('renders header links from matched route handle', () => {
    useLocationMock.mockReturnValue({ pathname: '/profile' });
    useMatchesMock.mockReturnValue([
      {
        handle: {
          headerLinks: [
            { to: '/profile/info', label: 'Info' },
            { to: '/profile/settings', label: 'Settings' },
          ],
        },
      },
    ]);

    render(<Header {...mockProps} />);

    expect(screen.getByTestId('link-/profile/info')).toBeInTheDocument();
    expect(screen.getByTestId('link-/profile/settings')).toBeInTheDocument();
    expect(screen.getByText('Info')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('uses the last matched route with headerLinks', () => {
    useLocationMock.mockReturnValue({ pathname: '/nested' });
    useMatchesMock.mockReturnValue([
      {
        handle: {
          headerLinks: [{ to: '/old', label: 'Old' }],
        },
      },
      {
        handle: {
          headerLinks: [{ to: '/new', label: 'New' }],
        },
      },
    ]);

    render(<Header {...mockProps} />);

    expect(screen.queryByTestId('link-/old')).not.toBeInTheDocument();
    expect(screen.getByTestId('link-/new')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('renders no header links when matched routes do not provide them', () => {
    useLocationMock.mockReturnValue({ pathname: '/profile' });
    useMatchesMock.mockReturnValue([
      {},
      { handle: {} },
      { handle: { somethingElse: true } },
    ]);

    render(<Header {...mockProps} />);

    expect(screen.queryByRole('link', { name: 'Info' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Settings' })).not.toBeInTheDocument();
  });

  it('passes correct props to LinkAsButton', () => {
    useLocationMock.mockReturnValue({ pathname: '/profile' });
    useMatchesMock.mockReturnValue([
      {
        handle: {
          headerLinks: [
            { to: '/profile/info', label: 'Info' },
            { to: '/profile/settings', label: 'Settings' },
          ],
        },
      },
    ]);

    render(<Header {...mockProps} />);

    expect(linkMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/profile/info', children: 'Info' }),
    );
    expect(linkMock).toHaveBeenCalledWith(
      expect.objectContaining({ to: '/profile/settings', children: 'Settings' }),
    );
  });
});