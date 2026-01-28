import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerEffect } from '../model/register.effect';
import axios from 'axios';
import type {RegisterFormData} from "@/features/auth/register/model/register.types.ts";

export function useRegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);

    try {
      await registerEffect({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      navigate('/login', { replace: true });

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || 'Registration failed');
        return;
      }

      setServerError('Unexpected registration error');
    }
  };

  return { onSubmit, serverError };
}
