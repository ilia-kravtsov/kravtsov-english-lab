import { authApi } from '@/features/auth/session/api/auth.api';

import type { ForgotPasswordDto } from './forgot-password.dto';
import type { ForgotPasswordResponse } from './forgot-password.types';

export async function forgotPasswordEffect(
  dto: ForgotPasswordDto,
): Promise<ForgotPasswordResponse> {
  return await authApi.forgotPassword(dto);
}
