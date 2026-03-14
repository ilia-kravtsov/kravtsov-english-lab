import { authApi } from '@/features/auth/session/api/auth.api';
import { useUserStore } from '@/features/auth/user';

import type { RegisterDto } from './register.dto';

export async function registerEffect(dto: RegisterDto): Promise<void> {
  const { user, accessToken } = await authApi.register(dto);

  useUserStore.getState().setAuthData(user, accessToken);
}
