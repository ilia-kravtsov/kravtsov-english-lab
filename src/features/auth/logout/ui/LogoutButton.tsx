import { useState } from 'react';

import { useLogout } from '@/features/auth/logout/model/useLogout';
import { Button } from '@/shared/ui/Button/Button';
import { logoutButtonStyles } from '@/shared/ui/ButtonStyles/logout-button.styles';
import { ConfirmModal } from '@/shared/ui/Modal/ConfirmModal';

export function LogoutButton() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { logout } = useLogout();

  const handleConfirm = async () => {
    await logout();
    setModalOpen(false);
  };

  const handleCancel = () => {
    setModalOpen(false);
  };

  const handleClick = () => {
    setModalOpen(true);
  };

  return (
    <>
      <Button title="Logout" onClick={handleClick} style={logoutButtonStyles} />
      <ConfirmModal
        isOpen={isModalOpen}
        title={'Confirm Logout'}
        message={'Are you sure you want to logout?'}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </>
  );
}
