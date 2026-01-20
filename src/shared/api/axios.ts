import axios, {AxiosError, type InternalAxiosRequestConfig} from 'axios';
import {useUserStore} from "../../entities/user/model/user.store.ts";
import {refreshEffect} from "../../features/auth/refresh/model/refresh.effect.ts";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = useUserStore.getState().accessToken;

  if (accessToken) {
    config.headers = config.headers ?? {};
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await refreshEffect();
        const newAccessToken = useUserStore.getState().accessToken;
        if (newAccessToken) {
          originalRequest.headers = originalRequest.headers ?? {};
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
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