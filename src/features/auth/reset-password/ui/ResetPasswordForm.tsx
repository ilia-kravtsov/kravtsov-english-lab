import {type SubmitHandler, useForm} from 'react-hook-form';
import {useResetPasswordModel} from "@/features/auth/reset-password/model/reset-password.model.ts";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>New password</label>
        <input
          type="password"
          {...register('password', { required: 'Password is required' })}
        />
        {errors.password && <span>{errors.password.message}</span>}
      </div>

      {serverMessage && <div>{serverMessage}</div>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Reset password'}
      </button>
    </form>
  );
}