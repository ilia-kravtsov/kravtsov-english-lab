import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { resetPasswordEffect } from './reset-password.effect.ts';

export function useResetPasswordModel() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (password: string) => {
    setServerMessage(null);

    const token = sessionStorage.getItem('reset-token');

    if (!token) {
      setServerMessage('Reset token is missing');
      return;
    }

    try {
      const response = await resetPasswordEffect({ token, password });

      setServerMessage(response.message || 'Password has been reset');
      sessionStorage.removeItem('reset-token');

      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setServerMessage('Failed to reset password');
    }
  };

  return {
    submit,
    serverMessage,
  };
}
