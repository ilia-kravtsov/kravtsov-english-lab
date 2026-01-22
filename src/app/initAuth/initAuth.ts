import {useUserStore} from "@/entities/user";

export function initAuth() {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    useUserStore.getState().setAccessToken(accessToken);
  } else {
    useUserStore.getState().clearAuth();
  }
}
