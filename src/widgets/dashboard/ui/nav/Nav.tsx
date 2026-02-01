import { NavLink } from "react-router-dom";
import { useState } from "react";
import style from "./Nav.module.scss";
import {v4} from "uuid";
import {LinkAsButton} from "@/shared/ui/LinkAsButton/LinkAsButton.tsx";

type NavLink = {
  id: string;
  to: string;
  title: string;
}

export function Nav() {
  const [isOpen, setIsOpen] = useState(true);

  const navLinks: NavLink[] = [
    {id: v4(), to: 'daily-practice', title: 'Daily Practice'},
    {id: v4(), to: 'writing', title: 'Writing'},
    {id: v4(), to: 'speaking', title: 'Speaking'},
    {id: v4(), to: 'listening', title: 'Listening'},
    {id: v4(), to: 'reading', title: 'Reading'},
    {id: v4(), to: 'vocabulary', title: 'Vocabulary'},
    {id: v4(), to: 'theory', title: 'Theory'},
    {id: v4(), to: 'profile', title: 'Profile'},
    {id: v4(), to: 'rating', title: 'Rating'},
    {id: v4(), to: 'settings', title: 'Settings'},
  ];

  const linkStyles = {
    height: '40px',
    width: '140px',
    fontSize: '14px',
  }

  const containerStyles = `${style.container} ${!isOpen ? style.collapsed : ""}`;
  const burgerStyles = `${style.burger} ${isOpen ? style.open : ""}`;

  const toggle = () => {
    setIsOpen(prev => !prev);
  }

  return (
    <aside className={containerStyles}>
      <button
        className={burgerStyles}
        onClick={toggle}
        aria-label={"Toggle menu"}
      >
        <span className={style.burgerLine} />
        <span className={style.burgerLine} />
        <span className={style.burgerLine} />
      </button>

      <nav className={style.menu}>
        {navLinks.map((navLink: NavLink) => (
          <LinkAsButton
            key={navLink.id}
            to={navLink.to}
            style={linkStyles}
          >
            {navLink.title}
          </LinkAsButton>
        ))}
      </nav>
    </aside>
  );
}
