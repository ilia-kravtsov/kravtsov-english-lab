import {api} from '@/shared/api';
import type {LoginDto} from "@/features/auth/login/model/login.dto.ts";
import type {RegisterDto} from "@/features/auth/register/model/register.dto.ts";
import type {ForgotPasswordDto} from "@/features/auth/forgot-password/model/forgot-password.dto.ts";
import type {ResetPasswordDto} from "@/features/auth/reset-password/model/reset-password.dto.ts";
import type {ForgotPasswordResponse} from "@/features/auth/forgot-password/model/forgot-password.types.ts";
import type {ResetPasswordResponse} from "@/features/auth/reset-password/model/reset-password.types.ts";
import {apiRefresh} from "@/shared/api/api-refresh.ts";
import type {RefreshResponse} from "@/features/auth/refresh/model/refresh.types.ts";
import type {AuthResponse} from "@/features/auth/login/model/login.types.ts";
import type {MeResponse} from "@/features/auth/me/model/me.types.ts";

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
    const { data } = await apiRefresh.post<RefreshResponse>('/auth/refresh');
    return data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async me(): Promise<MeResponse> {
    const { data } = await api.get<MeResponse>('/auth/me');
    return data;
  },

  async forgotPassword(dto: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
    const { data } = await api.post<ForgotPasswordResponse>('/auth/forgot-password', dto);
    return data;
  },

  async resetPassword(dto: ResetPasswordDto): Promise<ResetPasswordResponse> {
    const { data } = await api.post<ResetPasswordResponse>('/auth/reset-password', dto);
    return data;
  },
};