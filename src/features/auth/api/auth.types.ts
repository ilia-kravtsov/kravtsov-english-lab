import type { User } from '@/features/auth/user';

export interface AuthResponse {
  user: User;
  accessToken: string;
}
