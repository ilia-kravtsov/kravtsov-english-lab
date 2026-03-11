import { useMatches } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import type { RouteHandle } from '@/shared/types/route-handle.ts';
import { PageHomeLink } from '@/shared/ui';
import { LinkAsButton } from '@/shared/ui/link-as-button/LinkAsButton';
import { linkStyles } from '@/shared/lib/styles/link.styles.ts';

import style from './Header.module.scss';

export function Header() {
  const matches = useMatches() as Array<{ handle?: RouteHandle }>;
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const match = [...matches].reverse().find((m) => m.handle?.headerLinks);
  const headerLinks = match?.handle?.headerLinks ?? [];

  return (
    <header className={style.container}>
      <nav className={style.navContainer}>
        {!isHomePage && <PageHomeLink />}
        {headerLinks.map((link) => (
          <LinkAsButton key={link.to} to={link.to} style={linkStyles}>
            {link.label}
          </LinkAsButton>
        ))}
      </nav>
    </header>
  );
}
