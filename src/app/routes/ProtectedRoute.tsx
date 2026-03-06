import { Navigate } from 'react-router-dom';

import { useUserStore } from '@/entities/user';
import type { WithChildren } from '@/shared/types/react.types';

export function ProtectedRoute({ children }: WithChildren) {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
