import {ResetPasswordForm} from "@/features/auth/reset-password/ui/ResetPasswordForm.tsx";
import styles from './ResetPasswordPage.module.scss';

export function ResetPasswordPage() {
  return (
    <div className={styles.container}>
      <h1>Reset password</h1>
      <ResetPasswordForm />
    </div>
  );
}
