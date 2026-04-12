import { beforeEach, describe, expect, it, vi } from 'vitest';

import { api } from '@/shared/api';
import { apiRefresh } from '@/shared/api/api-refresh';

import { authApi } from './auth.api';

vi.mock('@/shared/api', () => ({
  api: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock('@/shared/api/api-refresh', () => ({
  apiRefresh: {
    post: vi.fn(),
  },
}));

describe('authApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('login calls api and returns mapped response', async () => {
    const dto = {
      email: 'test@example.com',
      password: '123456',
    };

    const response = {
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
        },
        accessToken: 'token',
      },
    };

    vi.mocked(api.post).mockResolvedValue(response);

    const result = await authApi.login(dto);

    expect(api.post).toHaveBeenCalledWith('/auth/login', dto);
    expect(result).toEqual({
      user: response.data.user,
      accessToken: response.data.accessToken,
    });
  });

  it('register calls api and returns mapped response', async () => {
    const dto = {
      email: 'new@example.com',
      password: '123456',
      firstName: 'John',
      lastName: 'Doe',
    };

    const response = {
      data: {
        user: {
          id: '2',
          email: 'new@example.com',
          firstName: 'John',
          lastName: 'Doe',
          createdAt: new Date('2026-01-02T00:00:00.000Z'),
        },
        accessToken: 'register-token',
      },
    };

    vi.mocked(api.post).mockResolvedValue(response);

    const result = await authApi.register(dto);

    expect(api.post).toHaveBeenCalledWith('/auth/register', dto);
    expect(result).toEqual({
      user: response.data.user,
      accessToken: response.data.accessToken,
    });
  });

  it('refresh calls apiRefresh and returns data', async () => {
    const response = {
      data: {
        accessToken: 'refresh-token',
      },
    };

    vi.mocked(apiRefresh.post).mockResolvedValue(response);

    const result = await authApi.refresh();

    expect(apiRefresh.post).toHaveBeenCalledWith('/auth/refresh');
    expect(result).toEqual(response.data);
  });

  it('logout calls api post', async () => {
    vi.mocked(api.post).mockResolvedValue({ data: undefined });

    const result = await authApi.logout();

    expect(api.post).toHaveBeenCalledWith('/auth/logout');
    expect(result).toBeUndefined();
  });

  it('me calls api get and returns data', async () => {
    const response = {
      data: {
        user: {
          id: '3',
          email: 'me@example.com',
          firstName: 'Me',
          lastName: 'User',
          createdAt: new Date('2026-01-03T00:00:00.000Z'),
        },
      },
    };

    vi.mocked(api.get).mockResolvedValue(response);

    const result = await authApi.me();

    expect(api.get).toHaveBeenCalledWith('/auth/me');
    expect(result).toEqual(response.data);
  });

  it('forgotPassword calls api post and returns data', async () => {
    const dto = {
      email: 'forgot@example.com',
    };

    const response = {
      data: {
        message: 'Reset link sent',
      },
    };

    vi.mocked(api.post).mockResolvedValue(response);

    const result = await authApi.forgotPassword(dto);

    expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', dto);
    expect(result).toEqual(response.data);
  });

  it('resetPassword calls api post and returns data', async () => {
    const dto = {
      token: 'reset-token',
      password: 'new-password-123',
    };

    const response = {
      data: {
        message: 'Password reset successful',
      },
    };

    vi.mocked(api.post).mockResolvedValue(response);

    const result = await authApi.resetPassword(dto);

    expect(api.post).toHaveBeenCalledWith('/auth/reset-password', dto);
    expect(result).toEqual(response.data);
  });
});