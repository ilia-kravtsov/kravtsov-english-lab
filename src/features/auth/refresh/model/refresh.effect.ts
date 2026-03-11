import { useUserStore } from '@/features/auth/user';
import { authApi } from '@/features/auth/session/api/auth.api';

export async function refreshEffect(): Promise<void> {
  try {
    const { accessToken } = await authApi.refresh();

    useUserStore.getState().setAccessToken(accessToken);
  } catch {
    useUserStore.getState().clearAuth();
  }
}
