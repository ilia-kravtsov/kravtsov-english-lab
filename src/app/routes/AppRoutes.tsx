import {Route, Routes} from 'react-router-dom';
import {useUserStore} from "@/entities/user";
import {ProtectedRoute} from "./ProtectedRoute.tsx";
import {HomePage} from "@/pages/home";
import {ProfilePage} from "@/pages/profile";
import {VocabularyPage} from "@/pages/vocabulary";
import {AuthLayout} from "@/pages/auth/ui/AuthLayout.tsx";
import {ForgotPasswordPage} from "@/pages/forgot-password";
import {ResetPasswordPage} from "@/pages/reset-password";
import {LoginPage} from "@/pages/login";
import {RegisterPage} from "@/pages/register";
import {Dashboard} from "@/widgets/dashboard";

export function AppRoutes() {
  const isInitialized = useUserStore(s => s.isInitialized);

  if (!isInitialized) return <div>Loading...</div>;

  return (
    <Routes>
      <Route element={<AuthLayout/>}>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
        <Route path="/reset-password" element={<ResetPasswordPage/>}/>
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