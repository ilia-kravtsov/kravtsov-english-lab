import { Outlet, useLocation } from 'react-router-dom';
import s from './AuthLayout.module.scss'
import {LinkAsButton} from "@/shared/ui/LinkAsButton/LinkAsButton.tsx";

export function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname.includes('login');

  return (
    <div className={s.authContainer}>
      <Outlet />

      <div>
        {isLogin ? (
          <div className={s.container}>
            <h2 className={s.header}>Don’t have an Account Yet?</h2>
            <p className={s.paragraph}>
              Let’s get you all set up so you can start creating your first onboarding experience
            </p>
            <LinkAsButton to="/register">Register</LinkAsButton>
          </div>
        ) : (
          <div className={s.container}>
            <h2 className={s.header}>Already Signed up?</h2>
            <p className={s.paragraph}>
              Log in to your account so you can continue building and editing your onboarding flows
            </p>
            <LinkAsButton to="/login">Log in</LinkAsButton>
          </div>
        )}
      </div>
    </div>
  );
}
