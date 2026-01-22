import {authApi} from "@/shared/api/auth.api.ts";
import {useUserStore} from "@/entities/user";

export async function logoutEffect(): Promise<void> {
  try {
    await authApi.logout();
  } finally {
    useUserStore.getState().clearAuth();
  }
}