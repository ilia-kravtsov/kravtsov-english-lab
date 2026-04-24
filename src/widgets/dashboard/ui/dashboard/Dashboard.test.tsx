import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { forwardRef, type RefObject } from 'react';
import type * as RouterDom from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { Dashboard } from './Dashboard';

type NavProps = {
  isOpen: boolean;
  onLinkClick: () => void;
};

type HeaderProps = {
  onToggleMenu: (isOpenStatus: boolean) => void;
  isMenuOpen: boolean;
  burgerRef: RefObject<HTMLButtonElement | null>;
};

const navMock = vi.fn();
const burgerButtonMock = vi.fn();
const useMatchesMock = vi.fn();
const useLocationMock = vi.fn();

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = (await importOriginal()) as typeof RouterDom;

  return {
    ...actual,
    Outlet: () => <div data-testid="outlet">Outlet content</div>,
    useMatches: () => useMatchesMock(),
    useLocation: () => useLocationMock(),
  };
});

vi.mock('../header/Header', () => ({
  Header: ({ onToggleMenu, isMenuOpen, burgerRef }: HeaderProps) => {
    burgerButtonMock({
      isOpen: isMenuOpen,
      toggleBurger: onToggleMenu,
    });

    return (
      <div data-testid="header">
        Header
        <button
          ref={burgerRef}
          type="button"
          data-testid="burger-button"
          onClick={() => onToggleMenu(!isMenuOpen)}
        >
          {isMenuOpen ? 'close' : 'open'}
        </button>
      </div>
    );
  },
}));

vi.mock('../footer/Footer', () => ({
  Footer: () => <div data-testid="footer">Footer</div>,
}));

vi.mock('../nav/Nav', () => ({
  Nav: forwardRef<HTMLDivElement, NavProps>(({ isOpen, onLinkClick }, ref) => {
    navMock({ isOpen, onLinkClick });

    return (
      <div ref={ref} data-testid="nav">
        <span data-testid="nav-state">{isOpen ? 'open' : 'closed'}</span>
        <button type="button" data-testid="nav-link" onClick={onLinkClick}>
          Link
        </button>
      </div>
    );
  }),
}));

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useMatchesMock.mockReturnValue([]);
    useLocationMock.mockReturnValue({ pathname: '/' });
  });

  it('renders layout parts', () => {
    render(<Dashboard />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('burger-button')).toBeInTheDocument();
    expect(screen.getByTestId('nav')).toBeInTheDocument();
    expect(screen.getByTestId('outlet')).toBeInTheDocument();
  });

  it('renders nav closed by default', () => {
    render(<Dashboard />);

    expect(screen.getByTestId('nav-state')).toHaveTextContent('closed');
    expect(burgerButtonMock).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: false }));
    expect(navMock).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: false }));
  });

  it('opens nav when burger button is clicked', async () => {
    const user = userEvent.setup();

    render(<Dashboard />);

    await user.click(screen.getByTestId('burger-button'));

    expect(screen.getByTestId('nav-state')).toHaveTextContent('open');
    expect(burgerButtonMock).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: true }));
    expect(navMock).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: true }));
  });

  it('closes nav when nav link is clicked', async () => {
    const user = userEvent.setup();

    render(<Dashboard />);

    await user.click(screen.getByTestId('burger-button'));
    expect(screen.getByTestId('nav-state')).toHaveTextContent('open');

    await user.click(screen.getByTestId('nav-link'));

    expect(screen.getByTestId('nav-state')).toHaveTextContent('closed');
    expect(navMock).toHaveBeenLastCalledWith(expect.objectContaining({ isOpen: false }));
  });

  it('closes nav on outside click', async () => {
    const user = userEvent.setup();

    render(
      <div>
        <Dashboard />
        <button type="button" data-testid="outside">
          Outside
        </button>
      </div>,
    );

    await user.click(screen.getByTestId('burger-button'));
    expect(screen.getByTestId('nav-state')).toHaveTextContent('open');

    fireEvent.mouseDown(screen.getByTestId('outside'));

    expect(screen.getByTestId('nav-state')).toHaveTextContent('closed');
  });

  it('does not close nav when clicking inside nav', async () => {
    const user = userEvent.setup();

    render(<Dashboard />);

    await user.click(screen.getByTestId('burger-button'));
    expect(screen.getByTestId('nav-state')).toHaveTextContent('open');

    fireEvent.mouseDown(screen.getByTestId('nav'));

    expect(screen.getByTestId('nav-state')).toHaveTextContent('open');
  });

  it('toggles nav state on repeated burger clicks', async () => {
    const user = userEvent.setup();

    render(<Dashboard />);

    const burger = screen.getByTestId('burger-button');

    await user.click(burger);
    expect(screen.getByTestId('nav-state')).toHaveTextContent('open');

    await user.click(burger);
    expect(screen.getByTestId('nav-state')).toHaveTextContent('closed');
  });
});