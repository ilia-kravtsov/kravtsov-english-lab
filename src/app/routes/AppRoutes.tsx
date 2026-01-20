import { Routes, Route, Navigate } from 'react-router-dom';
import {useUserStore} from "../../entities/user/model/user.store.ts";
import {LoginForm} from "../../features/auth/login/ui/LoginForm.tsx";
import {RegisterForm} from "../../features/auth/register/ui/RegisterForm.tsx";

export function AppRoutes() {
  const { isAuthenticated, isInitialized } = useUserStore();

  if (!isInitialized) return <div>Loading...</div>;

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <LoginForm />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <RegisterForm />} />
      {/*<Route path="/" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />*/}
    </Routes>
  );
}