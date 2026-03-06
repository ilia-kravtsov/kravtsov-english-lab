import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

import { useUserStore } from '@/entities/user';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
