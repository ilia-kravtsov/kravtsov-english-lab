import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { showAuthErrorToast } from '@/features/auth/session/lib/show-auth-error-toast.ts';

import { forgotPasswordEffect } from './forgot-password.effect';

export function useForgotPasswordModel() {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!shouldRedirect) return;

    const timeoutId = window.setTimeout(() => {
      navigate('/reset-password');
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [navigate, shouldRedirect]);

  const submit = async (email: string) => {
    setShouldRedirect(false);

    try {
      const response = await forgotPasswordEffect({ email });

      if (response.token) {
        sessionStorage.setItem('reset-token', response.token);
      }

      toast.success(response.message || 'Reset instructions sent');
      setShouldRedirect(true);
    } catch (error: unknown) {
      showAuthErrorToast(error, 'Failed to send reset link. Try again.');
    }
  };

  return {
    submit,
  };
}
