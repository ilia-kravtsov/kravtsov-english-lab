import type { LoginDto } from './login.dto';
import { authApi } from '@/features/auth/api/auth.api.ts';
import { useUserStore } from '@/entities/user';

export async function loginEffect(dto: LoginDto): Promise<void> {
  const { user, accessToken } = await authApi.login(dto);

  useUserStore.getState().setAuthData(user, accessToken);
}
