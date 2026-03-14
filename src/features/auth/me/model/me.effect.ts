import { authApi } from '@/features/auth/session/api/auth.api';
import { type User, useUserStore } from '@/features/auth/user';

export async function meEffect(): Promise<void> {
  try {
    const data = await authApi.me();

    const user: User = {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: new Date(data.createdAt),
    };

    useUserStore.getState().setAuthData(user, useUserStore.getState().accessToken!);
  } catch {
    useUserStore.getState().clearAuth();
  }
}
