import {Button} from '@/shared/ui/Button/Button';
import {useLogout} from "@/features/auth/logout/model/useLogout.ts";

export function LogoutButton() {
  const { logout } = useLogout();
  const buttonStyles = {
    width: '120px',
    height: '36px',
    outline: '1px solid white',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px',
  }

  return (
    <Button
      title={"Logout"}
      onClick={logout}
      style={buttonStyles}
    />
  );
}