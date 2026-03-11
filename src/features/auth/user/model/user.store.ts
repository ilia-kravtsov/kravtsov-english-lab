import { createGStore } from 'create-gstore';
import { useState } from 'react';

import type { User } from './user.types.ts';

export interface UserState {
  user: User | null;
  accessToken: string | null;

  isAuthenticated: boolean;
  isInitialized: boolean;

  setAuthData: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string) => void;
  clearAuth: () => void;
}

export const useUserStore = createGStore<UserState>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return {
    user,
    accessToken,
    isAuthenticated,
    isInitialized,

    setAuthData: (user, token) => {
      setUser(user);
      setAccessToken(token);
      setIsAuthenticated(true);
      persistAccessToken(token);
      setIsInitialized(true);
    },

    setAccessToken: (token) => {
      setAccessToken(token);
      setIsAuthenticated(true);
      persistAccessToken(token);
      setIsInitialized(true);
    },

    clearAuth: () => {
      setUser(null);
      setAccessToken(null);
      setIsAuthenticated(false);

      localStorage.removeItem('accessToken');
      localStorage.removeItem('rememberMe');

      setIsInitialized(true);
    },
  };
});

function persistAccessToken(token: string) {
  const rememberMe = localStorage.getItem('rememberMe') === 'true';
  if (rememberMe) {
    localStorage.setItem('accessToken', token);
  }
}
