import {type SubmitHandler, useForm} from 'react-hook-form';
import {Button} from "@/shared/ui";
import {useForgotPasswordModel} from "@/features/auth/forgot-password/model/forgot-password.model.ts";
import styles from './ForgotPassrowdForm.module.scss'
import {Input} from "@/shared/ui/Input/Input.tsx";

interface FormData {
  email: string;
}

export function ForgotPasswordForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>();
  const { submit, serverMessage } = useForgotPasswordModel();

  const onSubmit: SubmitHandler<FormData> = async ({ email }) => {
    await submit(email);
  };

  return (
    <form
      className={styles.container}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.inputContainer}>
        <label htmlFor={'email'}>Enter your email</label>
        <Input
          type={"email"}
          id={"email"}
          placeholder={'example@test.com'}
          {...register('email', { required: 'Email is required' })}
        />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      <Button type="submit"
              disabled={isSubmitting}
              title={isSubmitting ? 'Sending...' : 'Send reset link'}
      />

      {serverMessage && <div>{serverMessage}</div>}
    </form>
  );
}
