import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import style from './LoginForm.module.scss';
import { Input } from '@/shared/ui/Input/Input.tsx';
import { Button } from '@/shared/ui';
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox.tsx';
import type { LoginFormData } from '@/features/auth/login/model/login.types.ts';
import { useLoginForm } from '@/features/auth/login/model/useLoginForm.ts';

export function LoginForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();
  const { submit, serverError } = useLoginForm();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    await submit(data);
  };

  return (
    <form className={style.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={style.inputContainer}>
        <label className={style.inputLabel} htmlFor={'email'}>
          Email
        </label>
        <Input
          id={'email'}
          type={'email'}
          data-error={!!errors.email}
          placeholder={'bondjames007@gmail.com'}
          {...register('email', { required: 'Email is required' })}
        />
        <div className={style.errorSlot}>{errors.email?.message}</div>
      </div>

      <div className={style.inputContainer}>
        <label className={style.inputLabel} htmlFor={'password'}>
          Password
        </label>
        <Input
          id={'password'}
          type={'password'}
          data-error={!!errors.password}
          placeholder={'qwerty12345'}
          {...register('password', { required: 'Password is required' })}
        />
        <div className={style.errorSlot}>{errors.password?.message}</div>
      </div>

      <div className={style.checkBoxLinkContainer}>
        <Controller
          name='rememberMe'
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Checkbox
              label={'Remember me'}
              checked={field.value}
              onChange={field.onChange}
              size={15}
            />
          )}
        />
        <Link className={style.link} to={'/forgot-password'}>
          Forgot password?
        </Link>
      </div>

      <Button
        type={'submit'}
        disabled={isSubmitting}
        title={isSubmitting ? 'Logging in...' : 'Login'}
      />

      {serverError && <div className={style.serverError}>{serverError}</div>}
    </form>
  );
}
