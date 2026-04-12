import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { useUserStore } from './user.store';

const mockUser = {
  id: 'user-1',
  email: 'john@example.com',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date(),
};

describe('useUserStore', () => {
  beforeEach(() => {
    localStorage.clear();

    renderHook(() => useUserStore());

    act(() => {
      useUserStore.getState().clearAuth();
    });
  });

  it('has initial state', () => {
    const state = useUserStore.getState();

    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isInitialized).toBe(true);
  });

  it('setAuthData sets user, token and auth flags', () => {
    act(() => {
      useUserStore.getState().setAuthData(mockUser, 'token-123');
    });

    const state = useUserStore.getState();

    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe('token-123');
    expect(state.isAuthenticated).toBe(true);
    expect(state.isInitialized).toBe(true);
  });

  it('setAuthData persists accessToken when rememberMe is true', () => {
    localStorage.setItem('rememberMe', 'true');

    act(() => {
      useUserStore.getState().setAuthData(mockUser, 'token-123');
    });

    expect(localStorage.getItem('accessToken')).toBe('token-123');
  });

  it('setAuthData does not persist accessToken when rememberMe is false', () => {
    localStorage.setItem('rememberMe', 'false');

    act(() => {
      useUserStore.getState().setAuthData(mockUser, 'token-123');
    });

    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('setAccessToken sets token and auth flags without changing user', () => {
    act(() => {
      useUserStore.getState().setAccessToken('token-456');
    });

    const state = useUserStore.getState();

    expect(state.user).toBeNull();
    expect(state.accessToken).toBe('token-456');
    expect(state.isAuthenticated).toBe(true);
    expect(state.isInitialized).toBe(true);
  });

  it('setAccessToken persists accessToken when rememberMe is true', () => {
    localStorage.setItem('rememberMe', 'true');

    act(() => {
      useUserStore.getState().setAccessToken('token-456');
    });

    expect(localStorage.getItem('accessToken')).toBe('token-456');
  });

  it('setAccessToken does not persist accessToken when rememberMe is missing', () => {
    act(() => {
      useUserStore.getState().setAccessToken('token-456');
    });

    expect(localStorage.getItem('accessToken')).toBeNull();
  });

  it('clearAuth resets state and removes persisted auth data', () => {
    localStorage.setItem('accessToken', 'token-123');
    localStorage.setItem('rememberMe', 'true');

    act(() => {
      useUserStore.getState().setAuthData(mockUser, 'token-123');
    });

    act(() => {
      useUserStore.getState().clearAuth();
    });

    const state = useUserStore.getState();

    expect(state.user).toBeNull();
    expect(state.accessToken).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.isInitialized).toBe(true);

    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(localStorage.getItem('rememberMe')).toBeNull();
  });
});