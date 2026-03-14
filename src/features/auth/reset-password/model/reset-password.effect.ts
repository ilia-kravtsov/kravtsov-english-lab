import type { ResetPasswordResponse } from '@/features/auth/reset-password/model/reset-password.types';
import { authApi } from '@/features/auth/session/api/auth.api';

import type { ResetPasswordDto } from './reset-password.dto';

export async function resetPasswordEffect(dto: ResetPasswordDto): Promise<ResetPasswordResponse> {
  return await authApi.resetPassword(dto);
}
