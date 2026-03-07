import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { showAuthErrorToast } from '@/features/auth/lib/showAuthErrorToast.ts';
import type { RegisterFormData } from '@/features/auth/register/model/register.types';

import { registerEffect } from '../model/register.effect';

export function useRegisterForm() {
  const navigate = useNavigate();

  const submit = async (data: RegisterFormData) => {
    try {
      await registerEffect({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      toast.success('Registration successful');
      navigate('/login', { replace: true });
    } catch (error: unknown) {
      showAuthErrorToast(error, 'Registration failed');
    }
  };

  return { submit };
}
