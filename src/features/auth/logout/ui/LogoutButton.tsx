import {Button} from '@/shared/ui/Button/Button';
import {useLogout} from "@/features/auth/logout/model/useLogout.ts";

export function LogoutButton() {
  const { logout } = useLogout();
  return (
    <Button
      title={"Logout"}
      onClick={logout}
      width={200}
    />
  );
}