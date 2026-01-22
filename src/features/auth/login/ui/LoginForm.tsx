import {type SubmitHandler, useForm} from 'react-hook-form';
import {loginEffect} from '../model/login.effect';
import {useState} from "react";
import axios from 'axios';
import {useNavigate} from "react-router-dom";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setServerError(null);
    try {
      await loginEffect({ email: data.email, password: data.password });

      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      navigate('/', { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message ?? 'Login failed');
        return;
      }

      setServerError('Unexpected login error');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input
          type="email"
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div>
        <label>
          <input type="checkbox" {...register('rememberMe')} />
          Remember me
        </label>

        <a href="/forgot-password">Forgot password?</a>
      </div>

      {serverError && <div>{serverError}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
