import { useUserStore } from '@/entities/user';
import { authApi } from '@/features/auth/api/auth.api.ts';

import type { LoginDto } from './login.dto';

export async function loginEffect(dto: LoginDto): Promise<void> {
  const { user, accessToken } = await authApi.login(dto);

  useUserStore.getState().setAuthData(user, accessToken);
}
