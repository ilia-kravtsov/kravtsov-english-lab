import { API_BASE_URL } from '@/shared/config/api-base-url.ts';

import { isAbsoluteUrl } from './is-absolute-url.ts';

export function toAbsoluteMediaUrl(url?: string | null): string | null {
  if (!url) return null;
  if (isAbsoluteUrl(url)) return url;
  return `${API_BASE_URL}${url}`;
}