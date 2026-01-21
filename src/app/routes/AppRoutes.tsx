import { Routes, Route, Navigate } from 'react-router-dom';
import {useUserStore} from "@/entities/user";
import {LoginForm} from "@/features/auth/login";
import {RegisterForm} from "@/features/auth/register";
import {ProtectedRoute} from "./ProtectedRoute.tsx";
import {Dashboard} from "@/pages/dashboard";
import {HomePage} from "@/pages/home";
import {ProfilePage} from "@/pages/profile";
import {VocabularyPage} from "@/pages/vocabulary";

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
      >
        <Route index element={<HomePage />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="vocabulary" element={<VocabularyPage />} />
      </Route>
    </Routes>
  );
}