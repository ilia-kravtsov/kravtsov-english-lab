import {LogoutButton} from "@/features/auth/logout";
import style from "./Header.module.scss"
import {NavLink, useMatches} from "react-router-dom";
import type {RouteHandle} from "@/shared/types/routeHandle.ts";

export function Header() {
  const matches = useMatches() as Array<{ handle?: RouteHandle }>;

  const headerLinks = (() => {
    const match = [...matches]
      .reverse()
      .find(m => m.handle?.headerLinks);

    return match?.handle?.headerLinks ?? [];
  })();

  return (
    <header className={style.container}>
      <nav className={style.navContainer}>
        {headerLinks.map(link => (
          <NavLink
            key={link.to}
            to={link.to}
            className={style.navLink}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <LogoutButton/>
    </header>
  );
};