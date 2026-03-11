import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import type { LoginFormData } from '@/features/auth/login/model/login.types';
import { useLoginForm } from '@/features/auth/login/model/use-login-form.ts';
import { Button } from '@/shared/ui';
import { Checkbox } from '@/shared/ui/checkbox/Checkbox';
import { Input } from '@/shared/ui/input/Input';

import style from './LoginForm.module.scss';

export function LoginForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>();
  const { submit } = useLoginForm();

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
          name="rememberMe"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Checkbox
              label={'Remember me'}
              checked={field.value}
              onChange={field.onChange}
              size={16}
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
    </form>
  );
}
