import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { api } from '@/shared/api';
import { useUserStore } from '@/entities/user';
import {refreshEffect} from "@/features/auth/refresh/model/refresh.effect.ts";

export function setupAuthResponseInterceptor() {
  api.interceptors.response.use(
    response => response,
    async (error: AxiosError) => {
      const originalRequest =
        error.config as InternalAxiosRequestConfig & { _retry?: boolean };

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          await refreshEffect();
          const newAccessToken = useUserStore.getState().accessToken;

          if (newAccessToken) {
            originalRequest.headers = originalRequest.headers ?? {};
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          }

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
