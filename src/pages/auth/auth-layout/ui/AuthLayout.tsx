import { Outlet, useLocation } from 'react-router-dom';

import { LinkAsButton } from '@/shared/ui/LinkAsButton/LinkAsButton';

import style from './AuthLayout.module.scss';

export function AuthLayout() {
  const location = useLocation();
  const pathname = location.pathname;

  const isLogin = pathname === '/login';
  const isRegister = pathname === '/register';

  const isSwitchAuth = isLogin || isRegister;

  if (!isSwitchAuth) {
    return (
      <div className={style.authContainer}>
        <div className={style.formWrapper}>
          <Outlet />
        </div>
      </div>
    );
  }

  return (
    <div className={style.authContainer} data-state={isLogin ? 'login' : 'register'}>
      {isLogin ? (
        <>
          <div className={style.panel} />
          <div className={style.infoPanel}>
            <div className={style.container}>
              <h2 className={style.header}>Don't you have an account yet?</h2>
              <p className={style.paragraph}>
                Let’s get you all set up so you can start creating your first onboarding experience
              </p>
              <LinkAsButton to={'/register'}>Register</LinkAsButton>
            </div>
          </div>
          <div className={style.formWrapper}>
            <Outlet />
          </div>
        </>
      ) : (
        <>
          <div className={style.panel} />
          <div className={style.formWrapper}>
            <Outlet />
          </div>
          <div className={style.infoPanel}>
            <div className={style.container}>
              <h2 className={style.header}>Already Signed up?</h2>
              <p className={style.paragraph}>
                Log in to your account so you can continue building and editing your onboarding
                flows
              </p>
              <LinkAsButton to={'/login'}>Log in</LinkAsButton>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
