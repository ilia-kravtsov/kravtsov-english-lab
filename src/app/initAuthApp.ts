import { initAuth } from '@/app/initAuth/initAuth.ts';
import { setupAuth } from '@/app/providers';

export function initAuthApp(): void {
  setupAuth();
  void initAuth();
}