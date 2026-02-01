import {NavLink} from "react-router-dom";

export function Nav() {
  return (
    <nav>
      <NavLink to="/">Home</NavLink>
      <NavLink to="/vocabulary">Vocabulary</NavLink>
      <NavLink to="/profile">Profile</NavLink>
    </nav>
  );
};