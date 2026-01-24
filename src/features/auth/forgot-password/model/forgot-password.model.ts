import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { forgotPasswordEffect } from './forgot-password.effect';

export function useForgotPasswordModel() {
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (email: string) => {
    setServerMessage(null);

    try {
      const response = await forgotPasswordEffect({ email });

      setServerMessage(response.message);

      if (response.token) {
        sessionStorage.setItem('reset-token', response.token);
      }

      setTimeout(() => navigate('/reset-password'), 2000);
    } catch {
      setServerMessage('Failed to send reset link. Try again.');
    }
  };

  return {
    submit,
    serverMessage,
  };
}
