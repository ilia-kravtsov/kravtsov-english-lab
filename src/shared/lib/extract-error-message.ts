import { AxiosError } from 'axios';

interface BackendErrorResponse {
  message?: string | string[];
  error?: string;
  statusCode?: number;
}

export function extractErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const data = error.response?.data as BackendErrorResponse | undefined;

    if (status === 409) {
      return 'Card set title already exists';
    }

    if (typeof data?.message === 'string') {
      return data.message;
    }

    if (Array.isArray(data?.message) && data.message.length > 0) {
      return data.message[0];
    }

    if (data?.error) {
      return data.error;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Request failed';
}
