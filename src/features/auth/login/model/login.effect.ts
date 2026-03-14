import { authApi } from '@/features/auth/session/api/auth.api';
import { useUserStore } from '@/features/auth/user';

import type { LoginDto } from './login.dto';

export async function loginEffect(dto: LoginDto): Promise<void> {
  const { user, accessToken } = await authApi.login(dto);

  useUserStore.getState().setAuthData(user, accessToken);
}
