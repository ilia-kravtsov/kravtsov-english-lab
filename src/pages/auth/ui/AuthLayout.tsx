import { Outlet, useLocation, Link } from 'react-router-dom';

export function AuthLayout() {
  const location = useLocation();
  const isLogin = location.pathname.includes('login');

  return (
    <div>
      <div>
        {isLogin ? (
          <div>
            <h2>Нет аккаунта?</h2>
            <Link to="/register">
              Зарегистрироваться
            </Link>
          </div>
        ) : (
          <div>
            <h2>Уже есть аккаунт?</h2>
            <Link to="/login">
              Войти
            </Link>
          </div>
        )}
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
}
