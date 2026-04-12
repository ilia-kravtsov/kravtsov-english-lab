import { beforeEach, describe, expect, it, vi } from 'vitest';

const requestUseMock = vi.fn();
const responseUseMock = vi.fn();

const createMock = vi.fn(() => ({
  defaults: {},
  interceptors: {
    request: {
      use: requestUseMock,
    },
    response: {
      use: responseUseMock,
    },
  },
}));

vi.mock('axios', () => ({
  default: {
    create: createMock,
  },
}));

describe('api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  it('creates axios instance with correct config', async () => {
    await import('./api-general.ts');

    expect(createMock).toHaveBeenCalledTimes(1);
    expect(createMock).toHaveBeenCalledWith({
      baseURL: expect.any(String),
      withCredentials: true,
    });
  });

  it('registers request interceptor that returns config unchanged', async () => {
    await import('./api-general.ts');

    const onFulfilled = requestUseMock.mock.calls[0][0];
    const config = { headers: { test: '1' } };

    expect(onFulfilled(config)).toBe(config);
  });

  it('registers response interceptor that returns response unchanged', async () => {
    await import('./api-general.ts');

    const onFulfilled = responseUseMock.mock.calls[0][0];
    const response = { data: { ok: true } };

    expect(onFulfilled(response)).toBe(response);
  });

  it('registers response interceptor that rejects error', async () => {
    await import('./api-general.ts');

    const onRejected = responseUseMock.mock.calls[0][1];
    const error = new Error('Request failed');

    await expect(onRejected(error)).rejects.toThrow('Request failed');
  });
});