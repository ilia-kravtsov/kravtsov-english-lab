import {ResetPasswordForm} from "@/features/auth/reset-password/ui/ResetPasswordForm.tsx";
import style from './ResetPasswordPage.module.scss';

export function ResetPassword() {
  return (
    <div className={style.container}>
      <h1>Reset password</h1>
      <ResetPasswordForm />
    </div>
  );
}
