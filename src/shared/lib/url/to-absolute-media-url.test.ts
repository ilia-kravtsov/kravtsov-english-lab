import { describe, expect, it, vi, beforeEach } from 'vitest';

import { toAbsoluteMediaUrl } from './to-absolute-media-url';

import { isAbsoluteUrl } from '@/shared/lib';
import { API_BASE_URL } from '@/shared/config/api-base-url.ts';

vi.mock('@/shared/lib', () => ({
  isAbsoluteUrl: vi.fn(),
}));

describe('toAbsoluteMediaUrl', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null when url is undefined', () => {
    expect(toAbsoluteMediaUrl(undefined)).toBeNull();
  });

  it('returns null when url is null', () => {
    expect(toAbsoluteMediaUrl(null)).toBeNull();
  });

  it('returns absolute url as is', () => {
    vi.mocked(isAbsoluteUrl).mockReturnValue(true);

    const url = 'https://cdn.com/image.png';

    const result = toAbsoluteMediaUrl(url);

    expect(isAbsoluteUrl).toHaveBeenCalledWith(url);
    expect(result).toBe(url);
  });

  it('prepends API_BASE_URL for relative url', () => {
    vi.mocked(isAbsoluteUrl).mockReturnValue(false);

    const url = '/images/test.png';

    const result = toAbsoluteMediaUrl(url);

    expect(isAbsoluteUrl).toHaveBeenCalledWith(url);
    expect(result).toBe(`${API_BASE_URL}${url}`);
  });

  it('works with relative url without leading slash', () => {
    vi.mocked(isAbsoluteUrl).mockReturnValue(false);

    const url = 'images/test.png';

    const result = toAbsoluteMediaUrl(url);

    expect(result).toBe(`${API_BASE_URL}${url}`);
  });
});