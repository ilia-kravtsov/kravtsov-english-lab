import {Controller, useForm} from 'react-hook-form';
import type {RegisterFormData} from "@/features/auth/register/model/register.types.ts";
import {useRegisterForm} from "@/features/auth/register/model/useRegisterForm.ts";
import styles from './RegisterForm.module.scss'
import {Input} from "@/shared/ui/Input/Input.tsx";
import {CustomCheckbox} from "@/shared/ui/Checkbox/Checkbox.tsx";
import {Button} from "@/shared/ui";

export function RegisterForm() {
  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>();
  const { onSubmit, serverError } = useRegisterForm();

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputContainer}>
        <label className={styles.inputLabel} htmlFor={'firstName'}>First Name</label>
        <Input type={"text"}
               id={'firstName'}
               placeholder={'Your first name'}
               {...register('firstName', { required: 'First Name is required' })}
        />
        {errors.firstName && <span>{errors.firstName.message}</span>}
      </div>

      <div className={styles.inputContainer}>
        <label className={styles.inputLabel} htmlFor={'lastName'}>Last Name</label>
        <Input type={"text"}
               id={'lastName'}
               placeholder={'Your last name'}
               {...register('lastName', { required: 'Last Name is required' })}
        />
        {errors.lastName && <span>{errors.lastName.message}</span>}
      </div>

      <div className={styles.inputContainer}>
        <label className={styles.inputLabel} htmlFor={'email'}>Email</label>
        <Input type={"email"}
               id={'email'}
               placeholder={'Your email'}
               {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <div className={styles.inputContainer}>
        <label className={styles.inputLabel} htmlFor={'password'}>Password</label>
        <Input type={"password"}
               id={'password'}
               placeholder={'Your password'}
               {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div className={styles.checkBoxLinkContainer}>
        <Controller
          name="terms"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <CustomCheckbox
              label={"Terms & Conditions"}
              checked={field.value}
              onChange={field.onChange}
              size={16}
            />
          )}
        />
        {errors.terms && <span>{errors.terms.message}</span>}
      </div>

      {serverError && <div>{serverError}</div>}

      <Button type={"submit"}
              disabled={isSubmitting}
              title={isSubmitting ? 'Registering...' : 'Register'}
      />
    </form>
  );
}
