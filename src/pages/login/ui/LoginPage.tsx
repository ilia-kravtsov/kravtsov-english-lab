import { LoginForm } from '@/features/auth/login';
import s from './LoginPage.module.scss';

export function LoginPage() {
  return (
    <div className={s.container}>
      <h2 className={s.header}>Log in to Your Account</h2>
      <LoginForm />
    </div>
  );
}
