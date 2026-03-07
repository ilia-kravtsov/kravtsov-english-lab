import { useUserStore } from '@/entities/user';
import { authApi } from '@/features/auth/api/auth.api';

import type { RegisterDto } from './register.dto';

export async function registerEffect(dto: RegisterDto): Promise<void> {
  const { user, accessToken } = await authApi.register(dto);

  useUserStore.getState().setAuthData(user, accessToken);
}
