import { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { registerEffect } from '../model/register.effect';
import axios from 'axios';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  terms: boolean;
}

export function RegisterForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();
  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    setServerError(null);

    try {
      await registerEffect({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message || 'Registration failed');
        return;
      }

      setServerError('Unexpected registration error')
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>First Name</label>
        <input type="text" {...register('firstName', { required: 'First Name is required' })} />
        {errors.firstName && <span>{errors.firstName.message}</span>}
      </div>

      <div>
        <label>Last Name</label>
        <input type="text" {...register('lastName', { required: 'Last Name is required' })} />
        {errors.lastName && <span>{errors.lastName.message}</span>}
      </div>

      <div>
        <label>Email</label>
        <input type="email" {...register('email', { required: 'Email is required' })} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label>Password</label>
        <input type="password" {...register('password', { required: 'Password is required' })} />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div>
        <label>
          <input type="checkbox" {...register('terms', { required: 'You must accept Terms & Conditions' })} />
          I accept lab's <a href="/terms" target="_blank">Terms & Conditions</a>
        </label>
        {errors.terms && <span>{errors.terms.message}</span>}
      </div>

      {serverError && <div>{serverError}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  );
}
