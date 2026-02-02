import {Route, Routes} from 'react-router-dom';
import {useUserStore} from "@/entities/user";
import {ProtectedRoute} from "./ProtectedRoute.tsx";
import {Home} from "@/pages/home";
import {Profile} from "@/pages/profile";
import {Vocabulary} from "@/pages/vocabulary";
import {Dashboard} from "@/widgets/dashboard";
import {AuthLayout} from "@/pages/auth/auth-layout";
import {Login} from "@/pages/auth/login";
import {Register} from "@/pages/auth/register";
import {ResetPassword} from "@/pages/auth/reset-password";
import {ForgotPassword} from "@/pages/auth/forgot-password";

export function AppRoutes() {
  const isInitialized = useUserStore(s => s.isInitialized);

  if (!isInitialized) return <div>Loading...</div>;

  return (
    <Routes>
      <Route element={<AuthLayout/>}>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
      </Route>

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard/>
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="vocabulary" element={<Vocabulary />} />
      </Route>
    </Routes>
  );
}