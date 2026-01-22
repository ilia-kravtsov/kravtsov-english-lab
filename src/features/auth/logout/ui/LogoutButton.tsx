import { logoutEffect } from '../model/logout.effect';
import { Button } from '@/shared/ui/button/Button';

export function LogoutButton() {
  const handleLogout = async () => {
    await logoutEffect();
  };

  return (
    <Button title={"Logout"} onClick={handleLogout} />
  );
}