import { useUserStore } from '@/entities/user';
import { authApi } from '@/features/auth/api/auth.api';

export async function logoutEffect(): Promise<void> {
  try {
    await authApi.logout();
  } finally {
    useUserStore.getState().clearAuth();
  }
}
