import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { LoginDto } from './login.dto';
import { loginEffect } from './login.effect';

export function useLoginForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const submit = async (data: LoginDto & { rememberMe: boolean }) => {
    setServerError(null);

    try {
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      await loginEffect({ email: data.email, password: data.password });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message ?? 'Login failed');
        return;
      }

      setServerError('Unexpected login error');
    }
  };

  return { submit, serverError };
}
