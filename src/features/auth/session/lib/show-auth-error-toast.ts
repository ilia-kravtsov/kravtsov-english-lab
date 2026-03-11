import { toast } from 'react-toastify';

import { getAuthErrorMessage } from './get-auth-error-message.ts';

export function showAuthErrorToast(error: unknown, fallback: string) {
  toast.error(getAuthErrorMessage(error, fallback));
}