import style from './Footer.module.scss';
import { LinkAsButton } from '@/shared/ui/LinkAsButton/LinkAsButton.tsx';

export function Footer() {
  type NavLink = {
    id: string;
    to: string;
    title: string;
  };

  const navLinks: NavLink[] = [
    { id: 'about', to: 'about', title: 'Author' },
    { id: 'contacts', to: 'contacts', title: 'Contacts' },
  ];

  const linkStyles = {
    height: '40px',
    width: '140px',
    fontSize: '14px',
  };

  return (
    <div className={style.container}>
      {navLinks.map((navLink: NavLink) => (
        <LinkAsButton key={navLink.id} to={navLink.to} style={linkStyles}>
          {navLink.title}
        </LinkAsButton>
      ))}
    </div>
  );
}
