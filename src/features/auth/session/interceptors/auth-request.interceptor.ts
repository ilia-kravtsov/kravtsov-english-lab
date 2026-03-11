import type { InternalAxiosRequestConfig } from 'axios';

import { useUserStore } from '@/features/auth/user';
import { api } from '@/shared/api';

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
