import { Outlet, NavLink } from 'react-router-dom';

export function Dashboard() {
  return (
    <div>
      <header>
        Header
      </header>

      <main>
        <Outlet />
      </main>

      <nav>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/vocabulary">Vocabulary</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </nav>
    </div>
  );
}