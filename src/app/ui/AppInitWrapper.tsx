import type { JSX } from 'react';

import { useUserStore } from '@/entities/user';

export function AppInitWrapper({ children }: { children: JSX.Element }) {
  const isInitialized = useUserStore((s) => s.isInitialized);
  if (!isInitialized) return <div>Loading...</div>;
  return children;
}
