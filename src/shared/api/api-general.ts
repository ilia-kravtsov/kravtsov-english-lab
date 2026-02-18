import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  console.log('[API] ->', config.method?.toUpperCase(), config.url, 'authHeader:', Boolean(config.headers?.Authorization));
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    console.log('[API] <-', err?.response?.status, err?.config?.url);
    return Promise.reject(err);
  },
);