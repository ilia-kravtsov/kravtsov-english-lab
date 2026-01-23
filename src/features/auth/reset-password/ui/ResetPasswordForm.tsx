import {type ChangeEvent, type FormEvent, useState} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { resetPasswordEffect } from '../model/resetPassword.effect';
import { Button } from '@/shared/ui/button/Button';

export function ResetPasswordForm() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = params.get('token');

  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return <p>Invalid reset link</p>;
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await resetPasswordEffect(token, password);
      navigate('/login', { replace: true });
    } catch {
      setError('Failed to reset password');
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={handleChange}
        required
      />

      {error && <p>{error}</p>}

      <Button type="submit" title="Reset password" />
    </form>
  );
}
