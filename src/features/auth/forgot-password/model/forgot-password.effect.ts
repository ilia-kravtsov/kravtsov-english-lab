import {authApi} from '@/features/auth/api/auth.api.ts';
import type { ForgotPasswordDto } from './forgot-password.dto';
import type { ForgotPasswordResponse } from './forgot-password.types.ts';

export async function forgotPasswordEffect(dto: ForgotPasswordDto): Promise<ForgotPasswordResponse> {
  return await authApi.forgotPassword(dto);
}