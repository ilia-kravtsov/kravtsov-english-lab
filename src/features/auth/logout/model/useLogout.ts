import { logoutEffect } from './logout.effect';

export function useLogout() {
  const logout = async () => {
    await logoutEffect();
  };

  return { logout };
}
