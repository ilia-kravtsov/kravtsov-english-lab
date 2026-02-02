import {Outlet} from 'react-router-dom';
import {Header} from "@/widgets/dashboard/ui/header/Header.tsx";
import {Nav} from "@/widgets/dashboard/ui/nav/Nav.tsx";
import {Footer} from "@/widgets/dashboard/ui/footer/Footer.tsx";
import style from './Dashboard.module.scss';
import {useEffect, useRef, useState} from "react";
import {BurgerButton} from "@/shared/ui/BurgerButton/BurgerButton.tsx";

export function Dashboard() {
  const [isOpen, setIsOpen] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        navRef.current &&
        !navRef.current.contains(target) &&
        burgerRef.current &&
        !burgerRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  const toggle = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className={style.container}>
      <Header/>

      <BurgerButton
        ref={burgerRef}
        toggleBurger={toggle}
        isOpen={isOpen}
      />

      <Nav
        isOpen={isOpen}
        ref={navRef}
      />

      <main>
        <Outlet />
      </main>

      <Footer/>
    </div>
  );
}