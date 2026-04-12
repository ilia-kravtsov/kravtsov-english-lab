import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { logoutEffect } from './logout.effect';
import { useLogout } from './use-logout';

vi.mock('./logout.effect', () => ({
  logoutEffect: vi.fn(),
}));

describe('useLogout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns logout function', () => {
    const { result } = renderHook(() => useLogout());

    expect(result.current.logout).toEqual(expect.any(Function));
  });

  it('calls logoutEffect when logout is invoked', async () => {
    vi.mocked(logoutEffect).mockResolvedValue(undefined);

    const { result } = renderHook(() => useLogout());

    await result.current.logout();

    expect(logoutEffect).toHaveBeenCalledTimes(1);
  });

  it('propagates error when logoutEffect rejects', async () => {
    const error = new Error('Logout failed');

    vi.mocked(logoutEffect).mockRejectedValue(error);

    const { result } = renderHook(() => useLogout());

    await expect(result.current.logout()).rejects.toThrow('Logout failed');
    expect(logoutEffect).toHaveBeenCalledTimes(1);
  });
});