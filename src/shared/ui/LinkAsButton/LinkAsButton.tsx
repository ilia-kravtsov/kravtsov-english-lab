import { Link, type LinkProps } from 'react-router-dom'
import style from './LinkAsButton.module.scss'
import type {ReactNode} from "react";

type Props = LinkProps & {
  children: ReactNode
}

export const LinkAsButton = ({ children, ...props }: Props) => {
  return (
    <Link className={style.linkAsButton} {...props}>
      {children}
    </Link>
  )
}
