import { AxiosError } from 'axios';
import { describe, expect, it } from 'vitest';

import { extractErrorMessage } from './extract-error-message';

describe('extractErrorMessage', () => {
  it('returns conflict message for axios error with 409 status', () => {
    const error = new AxiosError('Conflict');

    error.response = {
      status: 409,
      statusText: 'Conflict',
      headers: {},
      config: {} as never,
      data: {},
    };

    expect(extractErrorMessage(error)).toBe('Card set title already exists');
  });

  it('returns axios response message when it is a string', () => {
    const error = new AxiosError('Request failed');

    error.response = {
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
      data: {
        message: 'Validation failed',
      },
    };

    expect(extractErrorMessage(error)).toBe('Validation failed');
  });

  it('returns first axios response message when message is array', () => {
    const error = new AxiosError('Request failed');

    error.response = {
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
      data: {
        message: ['Title is required', 'Another error'],
      },
    };

    expect(extractErrorMessage(error)).toBe('Title is required');
  });

  it('returns axios response error field when message is missing', () => {
    const error = new AxiosError('Request failed');

    error.response = {
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: {} as never,
      data: {
        error: 'Internal server error',
      },
    };

    expect(extractErrorMessage(error)).toBe('Internal server error');
  });

  it('returns native error message for regular Error', () => {
    const error = new Error('Something went wrong');

    expect(extractErrorMessage(error)).toBe('Something went wrong');
  });

  it('returns fallback message for unknown non-error value', () => {
    expect(extractErrorMessage('oops')).toBe('Request failed');
  });

  it('returns fallback message for axios error without useful response data', () => {
    const error = new AxiosError('Network Error');

    expect(extractErrorMessage(error)).toBe('Network Error');
  });

  it('returns fallback message for axios error with empty message array and no error field', () => {
    const error = new AxiosError('Request failed');

    error.response = {
      status: 400,
      statusText: 'Bad Request',
      headers: {},
      config: {} as never,
      data: {
        message: [],
      },
    };

    expect(extractErrorMessage(error)).toBe('Request failed');
  });

  it('returns fallback message for null', () => {
    expect(extractErrorMessage(null)).toBe('Request failed');
  });
});