import { useUserStore } from '@/entities/user';
import { meEffect } from '@/features/auth/me/model/me.effect';

export async function initAuth() {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    useUserStore.getState().setAccessToken(accessToken);
    await meEffect();
  } else {
    useUserStore.getState().clearAuth();
  }
}
