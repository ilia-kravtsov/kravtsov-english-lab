import { useState } from 'react';

import { useLogout } from '@/features/auth/logout/model/use-logout';
import { Button } from '@/shared/ui/button/Button';
import { ConfirmModal } from '@/shared/ui/modal/ConfirmModal';

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
      <Button title="Logout" onClick={handleClick} />
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
