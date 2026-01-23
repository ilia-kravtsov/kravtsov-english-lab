import {Route, Routes} from 'react-router-dom';
import {useUserStore} from "@/entities/user";
import {ProtectedRoute} from "./ProtectedRoute.tsx";
import {Dashboard} from "@/pages/dashboard";
import {HomePage} from "@/pages/home";
import {ProfilePage} from "@/pages/profile";
import {VocabularyPage} from "@/pages/vocabulary";
import {AuthLayout} from "@/pages/auth/ui/AuthLayout.tsx";
import {LoginForm} from "@/features/auth/login";
import {RegisterForm} from "@/features/auth/register";
import {ForgotPasswordPage} from "@/pages/forgot-password";
import {ResetPasswordPage} from "@/pages/reset-password";

export function AppRoutes() {
  const isInitialized = useUserStore(s => s.isInitialized);

  if (!isInitialized) return <div>Loading...</div>;

  return (
    <Routes>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard/>
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