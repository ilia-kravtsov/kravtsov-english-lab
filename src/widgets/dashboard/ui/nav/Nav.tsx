import {NavLink} from "react-router-dom";
import style from "./Nav.module.scss";
import {LinkAsButton} from "@/shared/ui/LinkAsButton/LinkAsButton.tsx";
import {forwardRef, type Ref} from "react";

type NavLink = {
  id: string;
  to: string;
  title: string;
}

interface Props {
  isOpen: boolean;
  onLinkClick: () => void;
}

export const Nav = forwardRef<HTMLDivElement, Props>(
  ({ isOpen, onLinkClick }, ref: Ref<HTMLDivElement>) => {

  const navLinks: NavLink[] = [
    { id: 'daily', to: 'daily-practice', title: 'Daily Practice' },
    { id: 'writing', to: 'writing', title: 'Writing' },
    { id: 'speaking', to: 'speaking', title: 'Speaking' },
    { id: 'listening', to: 'listening', title: 'Listening' },
    { id: 'reading', to: 'reading', title: 'Reading' },
    { id: 'vocabulary', to: 'vocabulary', title: 'Vocabulary' },
    { id: 'theory', to: 'theory', title: 'Theory' },
    { id: 'profile', to: 'profile', title: 'Profile' },
    { id: 'rating', to: 'rating', title: 'Rating' },
    { id: 'settings', to: 'settings', title: 'Settings' },
  ];

  const linkStyles = {
    height: '40px',
    width: '100%',
    fontSize: '14px',
  }

  const containerStyles = `${style.container} ${!isOpen ? style.collapsed : ""}`;

  const handleClick = () => {
      onLinkClick()
  }

  return (
    <aside className={containerStyles} ref={ref}>
      <nav className={style.menu}>
        {navLinks.map((navLink: NavLink) => (
          <LinkAsButton
            key={navLink.id}
            to={navLink.to}
            style={linkStyles}
            onClick={handleClick}
          >
            {navLink.title}
          </LinkAsButton>
        ))}
      </nav>
    </aside>
  );
})