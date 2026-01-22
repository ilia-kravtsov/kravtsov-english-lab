import type { InternalAxiosRequestConfig } from 'axios';
import { api } from '@/shared/api';
import { useUserStore } from '@/entities/user';

export function setupAuthRequestInterceptor() {
  api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const accessToken = useUserStore.getState().accessToken;

    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });
}
