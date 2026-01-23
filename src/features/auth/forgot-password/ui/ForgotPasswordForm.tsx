import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, type SubmitHandler } from 'react-hook-form';
import {Button} from "@/shared/ui";
import {forgotPasswordEffect} from "@/features/auth/forgot-password/model/forgot-password.effect.ts";

interface FormData {
  email: string;
}

export function ForgotPasswordForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setServerMessage(null);
    try {
      const response = await forgotPasswordEffect({ email: data.email });
      setServerMessage(response.message);
      console.log('ForgotPasswordForm', response.token)
      if (response.token) {
        sessionStorage.setItem('reset-token', response.token);
      }

      setTimeout(() => navigate('/reset-password'), 3000);
    } catch {
      setServerMessage('Failed to send reset link. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input type="email" {...register('email', { required: 'Email is required' })} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      {serverMessage && <div>{serverMessage}</div>}

      <Button type="submit"
              disabled={isSubmitting}
              title={isSubmitting ? 'Sending...' : 'Send reset link'}
      />
    </form>
  );
}
