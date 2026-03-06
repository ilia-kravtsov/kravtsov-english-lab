import { ForgotPasswordForm } from '@/features/auth/forgot-password/ui/ForgotPasswordForm.tsx';

import style from './ForgotPasswordPage.module.scss';

export function ForgotPassword() {
  return (
    <div className={style.container}>
      <h1 className={style.header}>Forgot password</h1>
      <ForgotPasswordForm />
    </div>
  );
}
