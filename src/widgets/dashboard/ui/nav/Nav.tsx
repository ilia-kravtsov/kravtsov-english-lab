import { forwardRef, type Ref } from 'react';

import { dashboardSections } from '@/shared/config/dashboard-sections';
import { linkStyles } from '@/shared/lib/styles/link.styles';
import { LinkAsButton } from '@/shared/ui/link-as-button/LinkAsButton';

import style from './Nav.module.scss';

interface Props {
  isOpen: boolean;
  onLinkClick: () => void;
}

export const Nav = forwardRef<HTMLDivElement, Props>(
  ({ isOpen, onLinkClick }, ref: Ref<HTMLDivElement>) => {
    const containerStyles = `${style.container} ${!isOpen ? style.collapsed : ''}`;

    const handleClick = () => {
      onLinkClick();
    };

    return (
      <aside className={containerStyles} ref={ref}>
        <nav className={style.menu}>
          {dashboardSections.map((navLink) => (
            <LinkAsButton key={navLink.id} to={navLink.to} style={linkStyles} onClick={handleClick}>
              {navLink.title}
            </LinkAsButton>
          ))}
        </nav>
      </aside>
    );
  },
);
