import {type ChangeEvent, type FormEvent, useState} from 'react';
import { forgotPasswordEffect } from '../model/forgotPassword.effect';
import { Button } from '@/shared/ui/button/Button';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await forgotPasswordEffect(email);
      setSuccess(true);
    } catch {
      setError('Failed to send reset email');
    }
  };

  if (success) {
    return <p>Check your email for password reset instructions</p>;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleChange}
        required
      />

      {error && <p>{error}</p>}

      <Button type="submit" title="Send reset link" />
    </form>
  );
}
