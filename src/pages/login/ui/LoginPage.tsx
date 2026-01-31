import { LoginForm } from '@/features/auth/login';
import styles from './LoginPage.module.scss';

export function LoginPage() {
  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Log in to your account</h2>
      <LoginForm />
    </div>
  );
}
