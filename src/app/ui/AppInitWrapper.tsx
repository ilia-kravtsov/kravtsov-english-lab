import { useUserStore } from '@/features/auth/user';
import type { WithChildren } from '@/shared/types/react.types';

export function AppInitWrapper({ children }: WithChildren) {
  const isInitialized = useUserStore((s) => s.isInitialized);
  if (!isInitialized) return <div>Loading...</div>;
  return children;
}
