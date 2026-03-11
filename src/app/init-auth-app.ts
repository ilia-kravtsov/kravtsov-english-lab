import { initAuth } from '@/app/init-auth/init-auth.ts';
import { setupAuth } from '@/app/providers';

export function initAuthApp(): void {
  setupAuth();
  void initAuth();
}