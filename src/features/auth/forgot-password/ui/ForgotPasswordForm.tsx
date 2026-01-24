import {type SubmitHandler, useForm} from 'react-hook-form';
import {Button} from "@/shared/ui";
import {useForgotPasswordModel} from "@/features/auth/forgot-password/model/forgot-password.model.ts";

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
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Email</label>
        <input type="email" {...register('email', { required: 'Email is required' })} />
        {errors.email && <span>{errors.email.message}</span>}
      </div>

      {serverMessage && <div>{serverMessage}</div>}

      <Button type="submit"
              disabled={isSubmitting}
              title={isSubmitting ? 'Sending...' : 'Send reset link'}
      />
    </form>
  );
}
