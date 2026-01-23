import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { api } from '@/shared/api';
import { useUserStore } from '@/entities/user';
import {refreshEffect} from "@/features/auth/refresh/model/refresh.effect.ts";

export function setupAuthResponseInterceptor() {
  const excludedUrls = ['/auth/reset-password', '/auth/forgot-password', '/auth/login', '/auth/register'];

  api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest =
        error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (excludedUrls.includes(originalRequest.url || '')) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        console.log('Interceptor error status:', error.response?.status, 'retry:', originalRequest._retry);

        const currentToken = useUserStore.getState().accessToken;

        if (!currentToken) {
          useUserStore.getState().clearAuth();
          return Promise.reject(error);
        }

        try {
          await refreshEffect();

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
      }

      return Promise.reject(error);
    }
  );
}
