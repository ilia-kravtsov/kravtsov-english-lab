import { Outlet, NavLink } from 'react-router-dom';
import {LogoutButton} from "@/features/auth/logout";

export function Dashboard() {
  return (
    <div>
      <header>
        Header
        <LogoutButton/>
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