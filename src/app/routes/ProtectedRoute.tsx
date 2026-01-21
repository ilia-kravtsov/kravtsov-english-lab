import { Navigate } from 'react-router-dom';
import {useUserStore} from "../../entities/user/model/user.store.ts";
import type {JSX} from "react";

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = useUserStore(s => s.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
