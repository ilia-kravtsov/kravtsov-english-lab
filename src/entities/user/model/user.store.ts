import { createGStore } from 'create-gstore';
import { useState } from 'react';
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

export const useUserStore = createGStore<UserState>(() => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  return {
    user,
    accessToken,
    isAuthenticated: Boolean(user),
    isInitialized,

    setAuthData: (user, token) => {
      setUser(user);
      setAccessToken(token);
      setIsInitialized(true);
    },

    setAccessToken: (token) => {
      setAccessToken(token);
      setIsInitialized(true);
    },

    clearAuth: () => {
      setUser(null);
      setAccessToken(null);
      setIsInitialized(true);
    }
  };
});