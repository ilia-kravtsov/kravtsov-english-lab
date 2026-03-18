import { forwardRef } from 'react';

import style from './BurgerButton.module.scss';

interface Props {
  toggleBurger: (toggleStatus: boolean) => void;
  isOpen: boolean;
}

export const BurgerButton = forwardRef<HTMLButtonElement, Props>(
  ({ isOpen, toggleBurger }, ref) => {
    const burgerStyles = `${style.burger} ${isOpen ? style.open : ''}`;

    const toggle = () => {
      toggleBurger(!isOpen);
    };

    return (
      <button
        className={burgerStyles}
        onClick={toggle}
        aria-label={'Toggle menu'}
        ref={ref}
        type={'button'}
      >
        <span className={style.burgerLine} />
        <span className={style.burgerLine} />
        <span className={style.burgerLine} />
      </button>
    );
  },
);
