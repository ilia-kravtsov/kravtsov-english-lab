import {Outlet} from 'react-router-dom';
import {Header} from "@/widgets/dashboard/ui/header/Header.tsx";
import {Nav} from "@/widgets/dashboard/ui/nav/Nav.tsx";
import {Footer} from "@/widgets/dashboard/ui/footer/Footer.tsx";
import style from './Dashboard.module.scss';

export function Dashboard() {
  return (
    <div className={style.styles}>
      <Header/>

      <Nav/>

      <main>
        <Outlet />
      </main>

      <Footer/>
    </div>
  );
}