import { create } from 'zustand/react';

import type { User } from './user.types';

export interface UserState {
  user: User | null;
  accessToken: string | null;

  isAuthenticated: boolean;
  isInitialized: boolean;

  setAuthData: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isInitialized: false,

  setAuthData: (user, token) => {
    persistAccessToken(token);

    set({
      user,
      accessToken: token,
      isAuthenticated: true,
      isInitialized: true,
    });
  },

  setAccessToken: (token) => {
    persistAccessToken(token);

    set({
      accessToken: token,
      isAuthenticated: true,
      isInitialized: true,
    });
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('rememberMe');

    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isInitialized: true,
    });
  },
}));

function persistAccessToken(token: string) {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  if (rememberMe) {
    localStorage.setItem('accessToken', token);
  }
}
