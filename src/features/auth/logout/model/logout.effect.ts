import { authApi } from '@/features/auth/session/api/auth.api';
import { useUserStore } from '@/features/auth/user';

export async function logoutEffect(): Promise<void> {
  try {
    await authApi.logout();
  } finally {
    useUserStore.getState().clearAuth();
  }
}
