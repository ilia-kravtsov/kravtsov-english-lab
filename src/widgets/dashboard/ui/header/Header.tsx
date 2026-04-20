import type { RefObject } from 'react';
import { useMatches } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import type { RouteHandle } from '@/shared/types/route-handle';
import { BurgerButton, PageHomeLink } from '@/shared/ui';
import { LinkAsButton } from '@/shared/ui/link-as-button/LinkAsButton';

import style from './Header.module.scss';

type Props = {
  onToggleMenu: (isOpenStatus: boolean) => void;
  isMenuOpen: boolean;
  burgerRef: RefObject<HTMLButtonElement | null>;
}

export function Header({onToggleMenu, isMenuOpen, burgerRef}: Props) {
  const matches = useMatches() as Array<{ handle?: RouteHandle }>;
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const match = [...matches].reverse().find((m) => m.handle?.headerLinks);
  const headerLinks = match?.handle?.headerLinks ?? [];

  return (
    <header className={style.container}>
      <div className={style.leftSide}>
        <BurgerButton toggleBurger={onToggleMenu} isOpen={isMenuOpen} ref={burgerRef} />
      </div>
      <nav className={style.navContainer}>
        {!isHomePage && <PageHomeLink />}
        {headerLinks.map((link) => (
          <LinkAsButton key={link.to} to={link.to}>
            {link.label}
          </LinkAsButton>
        ))}
      </nav>
    </header>
  );
}
