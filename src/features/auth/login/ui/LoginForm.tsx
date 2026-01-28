import {Controller, type SubmitHandler, useForm} from 'react-hook-form';
import {Link} from "react-router-dom";
import styles from './LoginForm.module.scss'
import {Input} from "@/shared/ui/Input/Input.tsx";
import {Button} from "@/shared/ui";
import {CustomCheckbox} from "@/shared/ui/Checkbox/Checkbox.tsx";
import type {LoginFormData} from "@/features/auth/login/model/login.types.ts";
import {useLoginForm} from "@/features/auth/login/model/useLoginForm.ts";

export function LoginForm() {
  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();
  const { submit, serverError } = useLoginForm();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    await submit(data);
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputContainer}>
        <label className={styles.inputLabel} htmlFor={"email"}>Email</label>
        <Input
          id={"email"}
          type={"email"}
          placeholder={"Enter your email"}
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.inputContainer}>
        <label className={styles.inputLabel} htmlFor={"password"}>Password</label>
        <Input
          id={"password"}
          type={"password"}
          placeholder={"Enter your password"}
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div className={styles.checkBoxLinkContainer}>
        <Controller
          name="rememberMe"
          control={control}
          defaultValue={false}
          render={({ field }) => (
            <CustomCheckbox
              label={"Remember me"}
              checked={field.value}
              onChange={field.onChange}
              size={16}
            />
          )}
        />
        <Link className={styles.link}
              to={"/forgot-password"}
        >
          Forgot password?
        </Link>
      </div>

      {serverError && <div>{serverError}</div>}

      <Button type={"submit"}
              disabled={isSubmitting}
              title={isSubmitting ? 'Logging in...' : 'Login'}
      />
    </form>
  );
}
