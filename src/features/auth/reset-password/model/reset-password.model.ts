import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { showAuthErrorToast } from '@/features/auth/session/lib/show-auth-error-toast.ts';

import { resetPasswordEffect } from './reset-password.effect';

export function useResetPasswordModel() {
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!shouldRedirect) return;

    const timeoutId = window.setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [navigate, shouldRedirect]);

  const submit = async (password: string) => {
    setShouldRedirect(false);

    const token = sessionStorage.getItem('reset-token');

    if (!token) {
      toast.error('Reset token is missing');
      return;
    }

    try {
      const response = await resetPasswordEffect({ token, password });

      sessionStorage.removeItem('reset-token');
      toast.success(response.message || 'Password has been reset');
      setShouldRedirect(true);
    } catch (error: unknown) {
      showAuthErrorToast(error, 'Failed to reset password');
    }
  };

  return {
    submit,
  };
}
