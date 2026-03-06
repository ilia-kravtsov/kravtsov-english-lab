import { Link } from 'react-router-dom';

import style from './NotFound.module.scss';

export function NotFound() {
  return (
    <div className={style.container}>
      <h1>404</h1>
      <p>Page not found</p>
      <Link className={style.link} to="/">
        Go Home
      </Link>
    </div>
  );
}
