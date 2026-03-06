import { authApi } from '@/features/auth/api/auth.api.ts';
import type { ResetPasswordResponse } from '@/features/auth/reset-password/model/reset-password.types.ts';

import type { ResetPasswordDto } from './reset-password.dto.ts';

export async function resetPasswordEffect(dto: ResetPasswordDto): Promise<ResetPasswordResponse> {
  return await authApi.resetPassword(dto);
}
