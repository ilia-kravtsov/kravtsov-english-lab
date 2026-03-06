import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import type { RegisterFormData } from '@/features/auth/register/model/register.types.ts';
import { useRegisterForm } from '@/features/auth/register/model/useRegisterForm.ts';
import { Button } from '@/shared/ui';
import { Checkbox } from '@/shared/ui/Checkbox/Checkbox.tsx';
import { Input } from '@/shared/ui/Input/Input.tsx';

import style from './RegisterForm.module.scss';

export function RegisterForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();
  const { onSubmit, serverError } = useRegisterForm();

  return (
    <form className={style.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={style.inputsContainer}>
        <div className={style.inputContainer}>
          <label className={style.inputLabel} htmlFor={'firstName'}>
            First name
          </label>
          <Input
            type={'text'}
            id={'firstName'}
            data-error={!!errors.firstName}
            placeholder={'James'}
            {...register('firstName', { required: 'First Name is required' })}
          />
          <div className={style.errorSlot}>{errors.firstName?.message}</div>
        </div>

        <div className={style.inputContainer}>
          <label className={style.inputLabel} htmlFor={'lastName'}>
            Last name
          </label>
          <Input
            type={'text'}
            id={'lastName'}
            data-error={!!errors.password}
            placeholder={'Brown'}
            {...register('lastName', { required: 'Last Name is required' })}
          />
          <div className={style.errorSlot}>{errors.lastName?.message}</div>
        </div>
      </div>

      <div className={style.inputContainer}>
        <label className={style.inputLabel} htmlFor={'email'}>
          Email
        </label>
        <Input
          type={'email'}
          id={'email'}
          data-error={!!errors.email}
          placeholder={'brown@test.com'}
          {...register('email', { required: 'Email is required' })}
        />
        <div className={style.errorSlot}>{errors.email?.message}</div>
      </div>

      <div className={style.inputContainer}>
        <label className={style.inputLabel} htmlFor={'password'}>
          Enter a strong password
        </label>
        <Input
          type={'password'}
          id={'password'}
          data-error={!!errors.password}
          placeholder={'qwerty12345'}
          {...register('password', { required: 'Password is required' })}
        />
        <div className={style.errorSlot}>{errors.password?.message}</div>
      </div>

      <div className={style.checkBoxLinkContainer}>
        <Controller
          name="terms"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <Checkbox
              label={
                <>
                  I agree with{' '}
                  <Link to="/terms" onClick={(e) => e.stopPropagation()} className={style.link}>
                    Terms & Conditions
                  </Link>
                </>
              }
              checked={field.value}
              onChange={field.onChange}
              size={18}
            />
          )}
        />
        <div className={style.errorSlot}>{errors.terms?.message}</div>
      </div>

      <Button
        type={'submit'}
        disabled={isSubmitting}
        title={isSubmitting ? 'Registering...' : 'Register'}
      />

      {serverError && <div className={style.serverError}>{serverError}</div>}
    </form>
  );
}
