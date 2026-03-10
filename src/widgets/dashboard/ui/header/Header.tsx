import { useMatches } from 'react-router-dom';

import type { RouteHandle } from '@/shared/types/routeHandle';
import { LinkAsButton } from '@/shared/ui/LinkAsButton/LinkAsButton';
import { linkStyles } from '@/shared/ui/LinkStyles/link.styles';

import style from './Header.module.scss';

export function Header() {
  const matches = useMatches() as Array<{ handle?: RouteHandle }>;

  const match = [...matches].reverse().find((m) => m.handle?.headerLinks);
  const headerLinks = match?.handle?.headerLinks ?? [];

  return (
    <header className={style.container}>
      <nav className={style.navContainer}>
        {headerLinks.map((link) => (
          <LinkAsButton key={link.to} to={link.to} style={linkStyles}>
            {link.label}
          </LinkAsButton>
        ))}
      </nav>
    </header>
  );
}
