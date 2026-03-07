import { toast } from 'react-toastify';

import { getAuthErrorMessage } from './getAuthErrorMessage.ts';

export function showAuthErrorToast(error: unknown, fallback: string) {
  toast.error(getAuthErrorMessage(error, fallback));
}