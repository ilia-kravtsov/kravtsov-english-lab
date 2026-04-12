import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useLogout } from '@/features/auth/logout/model/use-logout';

import { LogoutButton } from './LogoutButton';

vi.mock('@/features/auth/logout/model/use-logout', () => ({
  useLogout: vi.fn(),
}));

describe('LogoutButton', () => {
  const logoutMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useLogout).mockReturnValue({
      logout: logoutMock,
    });
  });

  it('renders logout button', () => {
    render(<LogoutButton />);

    expect(screen.getByRole('button', { name: 'Logout' })).toBeInTheDocument();
  });

  it('does not render confirm modal content initially', () => {
    render(<LogoutButton />);

    expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure you want to logout?')).not.toBeInTheDocument();
  });

  it('opens confirm modal when logout button is clicked', async () => {
    const user = userEvent.setup();

    render(<LogoutButton />);

    await user.click(screen.getByRole('button', { name: 'Logout' }));

    expect(screen.getByText('Confirm Logout')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to logout?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Confirm' })).toBeInTheDocument();
  });

  it('closes confirm modal when cancel is clicked', async () => {
    const user = userEvent.setup();

    render(<LogoutButton />);

    await user.click(screen.getByRole('button', { name: 'Logout' }));
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure you want to logout?')).not.toBeInTheDocument();
  });

  it('calls logout when confirm is clicked', async () => {
    const user = userEvent.setup();

    logoutMock.mockResolvedValue(undefined);

    render(<LogoutButton />);

    await user.click(screen.getByRole('button', { name: 'Logout' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });

  it('closes confirm modal after successful confirm', async () => {
    const user = userEvent.setup();

    logoutMock.mockResolvedValue(undefined);

    render(<LogoutButton />);

    await user.click(screen.getByRole('button', { name: 'Logout' }));
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(screen.queryByText('Confirm Logout')).not.toBeInTheDocument();
    });

    expect(screen.queryByText('Are you sure you want to logout?')).not.toBeInTheDocument();
  });
});