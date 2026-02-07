import { authApi } from '@/features/auth/api/auth.api.ts';
import { useUserStore } from '@/entities/user';

export async function refreshEffect(): Promise<void> {
  try {
    const { accessToken } = await authApi.refresh();

    useUserStore.getState().setAccessToken(accessToken);
  } catch {
    useUserStore.getState().clearAuth();
  }
}
