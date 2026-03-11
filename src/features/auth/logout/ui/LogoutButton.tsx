import { useState } from 'react';

import { useLogout } from '@/features/auth/logout/model/use-logout.ts';
import { Button } from '@/shared/ui/button/Button';
import { buttonStyles } from '@/shared/lib/styles/button.styles.ts';
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
      <Button title="Logout" onClick={handleClick} style={buttonStyles} />
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
