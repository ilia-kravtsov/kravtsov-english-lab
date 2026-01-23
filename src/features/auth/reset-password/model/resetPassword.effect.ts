import { authApi } from '@/features/auth/api/auth.api';

export async function resetPasswordEffect(
  token: string,
  password: string
): Promise<void> {
  await authApi.resetPassword({ token, password });
}
