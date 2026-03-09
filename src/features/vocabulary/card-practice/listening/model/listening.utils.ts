import { API_BASE_URL } from '@/shared/config/api.ts';
import { isAbsoluteUrl } from '@/shared/lib/url/isAbsoluteUrl.ts';

export function toAbsoluteMediaUrl(url: string) {
  if (isAbsoluteUrl(url)) return url;
  return `${API_BASE_URL}${url}`;
}
