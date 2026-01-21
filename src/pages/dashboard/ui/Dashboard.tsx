import { Outlet, NavLink } from 'react-router-dom';

export function Dashboard() {
  return (
    <div>
      <header>
        <nav>
          <NavLink to="/">Home</NavLink>
          <NavLink to="/vocabulary">Vocabulary</NavLink>
          <NavLink to="/profile">Profile</NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}