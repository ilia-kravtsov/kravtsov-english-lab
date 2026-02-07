import { useUserStore } from '@/entities/user';
import type { JSX } from 'react';

export function AppInitWrapper({ children }: { children: JSX.Element }) {
  const isInitialized = useUserStore((s) => s.isInitialized);
  if (!isInitialized) return <div>Loading...</div>;
  return children;
}
