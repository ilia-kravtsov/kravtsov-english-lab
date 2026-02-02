import {Controller, useForm} from 'react-hook-form';
import type {RegisterFormData} from "@/features/auth/register/model/register.types.ts";
import {useRegisterForm} from "@/features/auth/register/model/useRegisterForm.ts";
import style from './RegisterForm.module.scss'
import {Input} from "@/shared/ui/Input/Input.tsx";
import {CustomCheckbox} from "@/shared/ui/Checkbox/Checkbox.tsx";
import {Button} from "@/shared/ui";
import {Link} from "react-router-dom";

export function RegisterForm() {
  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();
  const { onSubmit, serverError } = useRegisterForm();

  return (
    <form className={style.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={style.inputsContainer}>
        <div className={style.inputContainer}>
          <label className={style.inputLabel} htmlFor={'firstName'}>First name</label>
          <Input
            type={"text"}
            id={'firstName'}
            placeholder={'James'}
            {...register('firstName', { required: 'First Name is required' })}
          />
          {errors.firstName && <span>{errors.firstName.message}</span>}
        </div>

        <div className={style.inputContainer}>
          <label className={style.inputLabel} htmlFor={'lastName'}>Last name</label>
          <Input
            type={"text"}
            id={'lastName'}
            placeholder={'Brown'}
            {...register('lastName', { required: 'Last Name is required' })}
          />
          {errors.lastName && <span>{errors.lastName.message}</span>}
        </div>
      </div>

      <div className={style.inputContainer}>
        <label className={style.inputLabel} htmlFor={'email'}>Email</label>
        <Input
          type={"email"}
          id={'email'}
          placeholder={'brown@test.com'}
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div className={style.inputContainer}>
        <label className={style.inputLabel} htmlFor={'password'}>Enter a strong password</label>
        <Input
          type={"password"}
          id={'password'}
          placeholder={'qwerty12345'}
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div className={style.checkBoxLinkContainer}>
        <Controller
          name="terms"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <CustomCheckbox
              label={
                <>
                  I agree with{' '}
                  <Link
                    to="/terms"
                    onClick={(e) => e.stopPropagation()}
                    className={style.link}
                  >
                    Terms & Conditions
                  </Link>
                </>
              }
              checked={field.value}
              onChange={field.onChange}
              size={17}
            />
          )}
        />
        {errors.terms && <span>{errors.terms.message}</span>}
      </div>

      <Button type={"submit"}
              disabled={isSubmitting}
              title={isSubmitting ? 'Registering...' : 'Register'}
      />

      {serverError && <div>{serverError}</div>}
    </form>
  );
}
