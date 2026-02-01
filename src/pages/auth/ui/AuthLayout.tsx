import { Outlet, useLocation } from 'react-router-dom';
import s from './AuthLayout.module.scss'
import {LinkAsButton} from "@/shared/ui/LinkAsButton/LinkAsButton.tsx";

export function AuthLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  const isLogin = pathname === '/login';
  const isRegister = pathname === '/register';

  const isSwitchAuth = isLogin || isRegister;

  const linkStyles = {
    outline: '1px solid #fff'
  }

  if (!isSwitchAuth) {
    return (
      <div className={s.authContainer}>
        <div className={s.formWrapper}>
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className={s.authContainer} data-state={isLogin ? 'login' : 'register'}>

      {isLogin ? (
        <>
          <div className={s.panel} />
          <div className={s.infoPanel}>
            <div className={s.container}>
              <h2 className={s.header}>Don't you have an account yet?</h2>
              <p className={s.paragraph}>
                Let’s get you all set up so you can start creating your first onboarding experience
              </p>
              <LinkAsButton to="/register" style={linkStyles}>Register</LinkAsButton>
            </div>
          </div>
          <div className={s.formWrapper}>
            <Outlet />
          </div>
        </>
      ) : (
        <>
          <div className={s.panel} />
          <div className={s.formWrapper}>
            <Outlet />
          </div>
          <div className={s.infoPanel}>
            <div className={s.container}>
              <h2 className={s.header}>Already Signed up?</h2>
              <p className={s.paragraph}>
                Log in to your account so you can continue building and editing your onboarding flows
              </p>
              <LinkAsButton to="/login" style={linkStyles}>Log in</LinkAsButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
