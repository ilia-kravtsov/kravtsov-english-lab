import type { AxiosError, InternalAxiosRequestConfig } from 'axios';

import { refreshEffect } from '@/features/auth/refresh/model/refresh.effect.ts';
import { useUserStore } from '@/features/auth/user';
import { api } from '@/shared/api';

let refreshPromise: Promise<void> | null = null;

export function setupAuthResponseInterceptor() {
  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      const isUnauthorized = error.response?.status === 401;
      const hasAuthHeader = Boolean(originalRequest.headers?.Authorization);

      if (!isUnauthorized || originalRequest._retry || !hasAuthHeader) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        if (!refreshPromise) {
          refreshPromise = refreshEffect().finally(() => {
            refreshPromise = null;
          });
        }

        await refreshPromise;

        const newAccessToken = useUserStore.getState().accessToken;

        if (!newAccessToken) {
          useUserStore.getState().clearAuth();
          return Promise.reject(error);
        }

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch {
        useUserStore.getState().clearAuth();
        return Promise.reject(error);
      }
    },
  );
}
