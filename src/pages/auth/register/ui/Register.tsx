import { RegisterForm } from '@/features/auth/register';
import style from './RegisterPage.module.scss'

export function Register() {
  return (
    <div className={style.container}>
      <h1 className={style.header}>Register</h1>
      <RegisterForm />
    </div>
  );
}