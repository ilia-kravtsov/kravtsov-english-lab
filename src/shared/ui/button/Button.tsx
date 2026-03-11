import type { CSSProperties, MouseEvent } from 'react';

import style from './Button.module.scss';

interface ButtonProps {
  title: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<void>;
  disabled?: boolean;
  type?: 'button' | 'submit';
  style?: CSSProperties;
}

export function Button({
  title,
  onClick,
  disabled = false,
  type = 'button',
  style: externalStyle = {},
}: ButtonProps) {
  return (
    <button
      className={style.button}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={externalStyle}
    >
      {title}
    </button>
  );
}
