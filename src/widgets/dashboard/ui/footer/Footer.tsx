import { LogoutButton } from '@/features/auth/logout';
import { linkStyles } from '@/shared/lib/styles/link.styles';
import { LinkAsButton } from '@/shared/ui/link-as-button/LinkAsButton';

import style from './Footer.module.scss';

type NavLink = {
  id: string;
  to: string;
  title: string;
};

const navLinks: NavLink[] = [
  { id: 'about', to: 'about', title: 'Author' },
  { id: 'contacts', to: 'contacts', title: 'Contacts' },
];

export function Footer() {
  return (
    <div className={style.container}>
      {navLinks.map((navLink: NavLink) => (
        <LinkAsButton key={navLink.id} to={navLink.to} style={linkStyles}>
          {navLink.title}
        </LinkAsButton>
      ))}
      <LogoutButton />
    </div>
  );
}
