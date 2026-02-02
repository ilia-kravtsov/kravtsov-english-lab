import { LoginForm } from '@/features/auth/login';
import style from './LoginPage.module.scss';

export function Login() {
  return (
    <div className={style.container}>
      <h2 className={style.header}>Log in to your account</h2>
      <LoginForm />
    </div>
  );
}
