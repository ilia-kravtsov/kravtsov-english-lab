import {LogoutButton} from "@/features/auth/logout";
import style from "./Header.module.scss"

export function Header() {
  return (
    <header className={style.container}>
      <LogoutButton/>
    </header>
  );
};