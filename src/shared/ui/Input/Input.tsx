import {forwardRef, type InputHTMLAttributes} from 'react';
import style from './Input.module.scss';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    return <input ref={ref} className={style.input} {...props} />;
  }
);