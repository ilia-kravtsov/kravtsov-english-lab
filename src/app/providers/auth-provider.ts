import { setupAuthRequestInterceptor } from '@/features/auth/session/interceptors/auth-request.interceptor';
import { setupAuthResponseInterceptor } from '@/features/auth/session/interceptors/auth-response.interceptor';

export function setupAuth() {
  setupAuthRequestInterceptor();
  setupAuthResponseInterceptor();
}
