import { RegisterForm } from '@/features/auth/register';
import styles from './RegisterPage.module.scss'

export function RegisterPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Register</h1>
      <RegisterForm />
    </div>
  );
}