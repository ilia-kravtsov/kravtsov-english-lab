import { type SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/shared/ui';
import { useForgotPasswordModel } from '@/features/auth/forgot-password/model/forgot-password.model.ts';
import style from './ForgotPasswordForm.module.scss';
import { Input } from '@/shared/ui/Input/Input.tsx';

interface FormData {
  email: string;
}

export function ForgotPasswordForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();
  const { submit, serverMessage } = useForgotPasswordModel();

  const onSubmit: SubmitHandler<FormData> = async ({ email }) => {
    await submit(email);
  };

  return (
    <form className={style.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={style.inputContainer}>
        <label htmlFor={'email'}>Enter your email</label>
        <Input
          type={'email'}
          id={'email'}
          data-error={!!errors.email}
          placeholder={'example@test.com'}
          {...register('email', { required: 'Email is required' })}
        />
        <div className={style.errorSlot}>{errors.email?.message}</div>
      </div>

      <Button
        type='submit'
        disabled={isSubmitting}
        title={isSubmitting ? 'Sending...' : 'Send reset link'}
      />

      {serverMessage && (
        <div className={style.serverMessage}>{serverMessage}</div>
      )}
    </form>
  );
}
