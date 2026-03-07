import { useNavigate } from 'react-router-dom';

import { showAuthErrorToast } from '@/features/auth/lib/showAuthErrorToast.ts';

import type { LoginDto } from './login.dto';
import { loginEffect } from './login.effect';

export function useLoginForm() {
  const navigate = useNavigate();

  const submit = async (data: LoginDto & { rememberMe: boolean }) => {
    try {
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      await loginEffect({ email: data.email, password: data.password });
      navigate('/', { replace: true });
    } catch (error: unknown) {
      showAuthErrorToast(error, 'Login failed');
    }
  };

  return { submit };
}
