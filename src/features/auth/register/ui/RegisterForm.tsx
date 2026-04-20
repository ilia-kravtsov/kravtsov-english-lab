import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import type { RegisterFormData } from '@/features/auth/register/model/register.types';
import { useRegisterForm } from '@/features/auth/register/model/use-register-form';
import { authButtonStyles } from '@/shared/lib/styles/button.styles';
import { Button } from '@/shared/ui';
import { Checkbox } from '@/shared/ui/checkbox/Checkbox';
import { Input } from '@/shared/ui/input/Input';

import style from './RegisterForm.module.scss';

export function RegisterForm() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>();
  const { submit } = useRegisterForm();

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    await submit(data);
  };

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
            style={{ fontSize: '24px' }}
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
            data-error={!!errors.lastName}
            placeholder={'Brown'}
            style={{ fontSize: '24px' }}
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
          style={{ fontSize: '24px' }}
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
          style={{ fontSize: '24px' }}
          {...register('password', { required: 'Password is required' })}
        />
        <div className={style.errorSlot}>{errors.password?.message}</div>
      </div>

      <div className={style.checkBoxLinkContainer}>
        <Controller
          name="terms"
          control={control}
          defaultValue={false}
          rules={{
            required: 'You must accept Terms & Conditions',
          }}
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
              size={20}
            />
          )}
        />
        <div className={style.errorSlotTerms}>{errors.terms?.message}</div>
      </div>

      <Button
        type={'submit'}
        disabled={isSubmitting}
        style={authButtonStyles}
        title={isSubmitting ? 'Registering...' : 'Register'}
      />
    </form>
  );
}
