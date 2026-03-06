import type { ReactNode } from 'react';
import { v4 } from 'uuid';

import style from './Checkbox.module.scss';

interface Props {
  size?: number;
  label?: string | ReactNode;
  checked?: string | boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = ({ size = 24, label, checked = false, onChange }: Props) => {
  const checkBoxId = `checkbox_id_${v4()}`;

  const checkBoxSize = {
    width: size,
    height: size,
  };

  const checkBoxClassNames = `${style.innerSquare} ${checked ? style.checked : ''}`;

  const changeStatus = () => {
    onChange?.(!checked);
  };

  return (
    <div className={style.container}>
      <div className={style.checkbox} id={checkBoxId} onClick={changeStatus} style={checkBoxSize}>
        <div className={checkBoxClassNames} />
      </div>
      <label className={style.label} htmlFor={checkBoxId} onClick={changeStatus}>
        {label}
      </label>
    </div>
  );
};
