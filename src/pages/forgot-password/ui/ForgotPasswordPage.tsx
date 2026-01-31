import {ForgotPasswordForm} from "@/features/auth/forgot-password/ui/ForgotPasswordForm.tsx";
import styles from './ForgotPasswordPage.module.scss'

export function ForgotPasswordPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Forgot password</h1>
      <ForgotPasswordForm />
    </div>
  );
}
