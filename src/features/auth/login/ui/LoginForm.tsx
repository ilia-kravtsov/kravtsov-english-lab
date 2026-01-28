import {Controller, type SubmitHandler, useForm} from 'react-hook-form';
import {loginEffect} from '../model/login.effect';
import {useState} from "react";
import axios from 'axios';
import {Link, useNavigate} from "react-router-dom";
import styles from './LoginForm.module.scss'
import {Input} from "@/shared/ui/Input/Input.tsx";
import {Button} from "@/shared/ui";
import {CustomCheckbox} from "@/shared/ui/Checkbox/Checkbox.tsx";

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export function LoginForm() {
  const { control, register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>();
  const [serverError, setServerError] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setServerError(null);
    try {

      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      await loginEffect({ email: data.email, password: data.password });
      navigate('/', { replace: true });
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setServerError(err.response?.data?.message ?? 'Login failed');
        return;
      }

      setServerError('Unexpected login error');
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputContainer}>
        <label className={styles.inputLabel} htmlFor={"email"}>Email</label>
        <Input
          id={"email"}
          className={styles.input}
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
          className={styles.input}
          type={"password"}
          placeholder={"Enter your password"}
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      <div className={styles.inputContainer}>
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
