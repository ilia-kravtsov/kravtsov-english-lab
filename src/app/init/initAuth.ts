import {useUserStore} from "../../entities/user/model/user.store.ts";

export function initAuth() {
  const accessToken = localStorage.getItem('accessToken');

  if (accessToken) {
    useUserStore.getState().setAccessToken(accessToken);
  } else {
    useUserStore.getState().clearAuth();
  }
}
