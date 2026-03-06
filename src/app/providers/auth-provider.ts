import { setupAuthRequestInterceptor } from '@/features/auth/interceptors/auth-request.interceptor';
import { setupAuthResponseInterceptor } from '@/features/auth/interceptors/auth-response.interceptor';

export function setupAuth() {
  setupAuthRequestInterceptor();
  setupAuthResponseInterceptor();
}
