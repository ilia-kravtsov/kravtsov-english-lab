import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { resetPasswordEffect } from "@/features/auth/reset-password/model/reset-password.effect.ts";

interface FormData {
  password: string;
}

export function ResetPasswordForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>();

  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const token = sessionStorage.getItem('reset-token');
    console.log('ResetPasswordForm', token)
    if (!token) {
      setServerMessage('Reset token is missing');
      return;
    }

    try {
      const response = await resetPasswordEffect({
        token,
        password: data.password,
      });

      setServerMessage(response.message);
      sessionStorage.removeItem('reset-token');

      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setServerMessage('Failed to reset password');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>New password</label>
        <input
          type="password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      {serverMessage && <div>{serverMessage}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Reset password'}
      </button>
    </form>
  );
}