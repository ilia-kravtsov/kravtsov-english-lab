import { Outlet, useLocation, Link } from 'react-router-dom';
import s from './AuthLayout.module.scss'

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
            <Link className={s.link} to="/register">Register</Link>
          </div>
        ) : (
          <div className={s.container}>
            <h2 className={s.header}>Already Signed up?</h2>
            <p className={s.paragraph}>
              Log in to your account so you can continue building and editing your onboarding flows
            </p>
            <Link className={s.link} to="/login">Log in</Link>
          </div>
        )}
      </div>
    </div>
  );
}
