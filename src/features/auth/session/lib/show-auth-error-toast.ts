import { toast } from 'react-toastify';

import { getAuthErrorMessage } from '@/features/auth/session';

export function showAuthErrorToast(error: unknown, fallback: string) {
  toast.error(getAuthErrorMessage(error, fallback));
}