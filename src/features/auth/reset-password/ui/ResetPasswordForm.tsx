import {type SubmitHandler, useForm} from 'react-hook-form';
import {useResetPasswordModel} from "@/features/auth/reset-password/model/reset-password.model.ts";
import style from './ResetPasswordForm.module.scss';
import { Input } from "@/shared/ui/Input/Input.tsx";
import {Button} from "@/shared/ui";

interface FormData {
  password: string;
}

export function ResetPasswordForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>();
  const { submit, serverMessage } = useResetPasswordModel();

  const onSubmit: SubmitHandler<FormData> = async ({ password }) => {
    await submit(password);
  };

  return (
    <form
      className={style.container}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={style.inputContainer}>
        <label htmlFor={'password'}>Please, enter a strong password</label>
        <Input
          id={'password'}
          type={'password'}
          placeholder={'qwerty12345'}
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      {serverMessage && <div>{serverMessage}</div>}

      <Button
        type={'submit'}
        title={isSubmitting ? 'Saving...' : 'Reset password'}
        disabled={isSubmitting}
      />
    </form>
  );
}