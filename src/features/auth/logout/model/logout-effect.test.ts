import { beforeEach, describe, expect, it, vi } from 'vitest';

import { logoutEffect } from '@/features/auth/logout/model/logout.effect';
import { authApi } from '@/features/auth/session/api/auth.api';
import { useUserStore } from '@/features/auth/user';

vi.mock('@/features/auth/session/api/auth.api', () => ({
  authApi: {
    logout: vi.fn(),
  },
}));

const clearAuthMock = vi.fn();

vi.mock('@/features/auth/user', () => ({
  useUserStore: {
    getState: vi.fn(() => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: false,
      setAuthData: vi.fn(),
      setAccessToken: vi.fn(),
      clearAuth: clearAuthMock,
    })),
  },
}));

describe('logoutEffect', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls authApi.logout and then clears auth state when logout succeeds', async () => {
    vi.mocked(authApi.logout).mockResolvedValue(undefined);

    await logoutEffect();

    expect(authApi.logout).toHaveBeenCalledTimes(1);
    expect(useUserStore.getState).toHaveBeenCalledTimes(1);
    expect(clearAuthMock).toHaveBeenCalledTimes(1);
  });

  it('clears auth state even when authApi.logout rejects', async () => {
    vi.mocked(authApi.logout).mockRejectedValue(new Error('logout failed'));

    await expect(logoutEffect()).rejects.toThrow('logout failed');

    expect(authApi.logout).toHaveBeenCalledTimes(1);
    expect(useUserStore.getState).toHaveBeenCalledTimes(1);
    expect(clearAuthMock).toHaveBeenCalledTimes(1);
  });

  it('calls clearAuth after logout attempt', async () => {
    const events: string[] = [];

    vi.mocked(authApi.logout).mockImplementation(async () => {
      events.push('logout');
    });

    vi.mocked(useUserStore.getState).mockImplementation(() => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: false,
      setAuthData: vi.fn(),
      setAccessToken: vi.fn(),
      clearAuth: () => {
        events.push('clearAuth');
      },
    }));

    await logoutEffect();

    expect(events).toEqual(['logout', 'clearAuth']);
  });
});