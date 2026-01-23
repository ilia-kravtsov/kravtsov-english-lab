import { api } from '@/shared/api';
import type {User} from "@/entities/user";
import type {LoginDto} from "@/features/auth/login/model/login.dto.ts";
import type {RegisterDto} from "@/features/auth/register/model/register.dto.ts";

interface AuthResponse {
  user: User;
  accessToken: string;
}

interface RefreshResponse {
  accessToken: string;
}

interface MeResponse {
  userId: string;
  email: string;
}

export const authApi = {
  async login(dto: LoginDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/login', dto);
    return {
      user: data.user,
      accessToken: data.accessToken,
    };
  },

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/auth/register', dto);
    return {
      user: data.user,
      accessToken: data.accessToken,
    };
  },

  async refresh(): Promise<RefreshResponse> {
    const { data } = await api.post<RefreshResponse>('/auth/refresh');
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async me(): Promise<MeResponse> {
    const { data } = await api.get<MeResponse>('/auth/me');
    return data;
  },

  async forgotPassword(dto: { email: string }): Promise<void> {
    await api.post('/auth/forgot-password', dto);
  },

  async resetPassword(dto: { token: string; password: string }): Promise<void> {
    await api.post('/auth/reset-password', dto);
  },
};