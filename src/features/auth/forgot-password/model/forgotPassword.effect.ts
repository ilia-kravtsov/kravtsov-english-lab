import { authApi } from '@/features/auth/api/auth.api';

export async function forgotPasswordEffect(email: string): Promise<void> {
  await authApi.forgotPassword({ email });
}
