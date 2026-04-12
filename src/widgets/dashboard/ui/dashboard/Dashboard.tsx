import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import { BurgerButton } from '@/shared/ui/burger-button/BurgerButton';
import { Footer } from '@/widgets/dashboard/ui/footer/Footer';
import { Header } from '@/widgets/dashboard/ui/header/Header';
import { Nav } from '@/widgets/dashboard/ui/nav/Nav';

import style from './Dashboard.module.scss';

export function Dashboard() {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const toggleMenuRef = useRef<HTMLButtonElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        toggleMenuRef.current &&
        !toggleMenuRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const handleToggleNav = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClick = () => {
    setIsOpen(false);
  };

  return (
    <div className={style.container}>
      <Header />

      <BurgerButton toggleBurger={handleToggleNav} isOpen={isOpen} ref={toggleMenuRef} />

      <Nav onLinkClick={handleClick} isOpen={isOpen} ref={navRef} />

      <main className={style.main}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
