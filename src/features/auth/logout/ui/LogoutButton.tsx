import {Button} from '@/shared/ui/Button/Button';
import {useLogout} from "@/features/auth/logout/model/useLogout.ts";
import {useState} from "react";
import {ConfirmModal} from "@/shared/ui/Modal/ConfirmModal.tsx";

export function LogoutButton() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { logout } = useLogout();

  const handleConfirm = async () => {
    await logout();
    setModalOpen(false);
  }

  const handleCancel = () => {
    setModalOpen(false);
  }

  const handleClick = () => {
    setModalOpen(true)
  }

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
    <>
      <Button title="Logout" onClick={handleClick} style={buttonStyles}/>
      <ConfirmModal
        isOpen={isModalOpen}
        title={"Confirm Logout"}
        message={"Are you sure you want to logout?"}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}