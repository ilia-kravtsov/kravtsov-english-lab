import { useMatches } from 'react-router-dom';

import type { RouteHandle } from '@/shared/types/routeHandle.ts';
import { LinkAsButton } from '@/shared/ui/LinkAsButton/LinkAsButton.tsx';

import style from './Header.module.scss';

export function Header() {
  const matches = useMatches() as Array<{ handle?: RouteHandle }>;

  const headerLinks = (() => {
    const match = [...matches].reverse().find((m) => m.handle?.headerLinks);

    return match?.handle?.headerLinks ?? [];
  })();

  const linkStyles = {
    height: '40px',
    width: '120px',
    fontSize: '14px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

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
