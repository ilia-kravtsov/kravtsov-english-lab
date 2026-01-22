import { Outlet, useLocation, Link } from 'react-router-dom';
import cls from './AuthLayout.module.scss';

export function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname.includes('login');

  return (
    <div className={cls.root}>
      <div className={cls.left}>
        {isLogin ? (
          <div>
            <h2>Нет аккаунта?</h2>
            <Link to="/register" className={cls.button}>
              Зарегистрироваться
            </Link>
          </div>
        ) : (
          <div>
            <h2>Уже есть аккаунт?</h2>
            <Link to="/login" className={cls.button}>
              Войти
            </Link>
          </div>
        )}
      </div>

      <div className={cls.right}>
        <Outlet />
      </div>
    </div>
  );
}
