import { Routes, Route, Navigate } from 'react-router-dom';
import {useUserStore} from "../../entities/user/model/user.store.ts";
import {LoginForm} from "../../features/auth/login/ui/LoginForm.tsx";
import {RegisterForm} from "../../features/auth/register/ui/RegisterForm.tsx";
import {ProtectedRoute} from "./ProtectedRoute.tsx";

export function AppRoutes() {
  const isAuthenticated = useUserStore(s => s.isAuthenticated);
  const isInitialized = useUserStore(s => s.isInitialized);

  if (!isInitialized) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/" replace /> : <LoginForm />}
      />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterForm />}
      />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}