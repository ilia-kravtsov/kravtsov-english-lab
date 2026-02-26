export function norm(s: string) {
  return s.trim().toLowerCase();
}

export function round(n: number) {
  return Math.round(n);
}

const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export function toAbsoluteMediaUrl(url: string) {
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${apiBaseUrl}${url}`;
}