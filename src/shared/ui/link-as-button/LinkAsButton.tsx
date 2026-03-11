import type { CSSProperties, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';

import style from './LinkAsButton.module.scss';

type Props = LinkProps & {
  children: ReactNode;
  style?: CSSProperties;
};

export const LinkAsButton = ({ children, style: externalStyle, ...props }: Props) => {
  return (
    <Link className={style.linkAsButton} style={externalStyle} {...props}>
      {children}
    </Link>
  );
};
