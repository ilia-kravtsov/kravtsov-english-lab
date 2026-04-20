import type { ReactNode } from 'react';

import style from './Checkbox.module.scss';

interface Props {
  size?: number;
  label?: string | ReactNode;
  checked?: string | boolean;
  onChange?: (checked: boolean) => void;
}

export const Checkbox = ({ size = 24, label, checked = false, onChange }: Props) => {
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
      <div className={style.checkbox} onClick={changeStatus} style={checkBoxSize} role={'checkbox'}>
        <div className={checkBoxClassNames} />
      </div>
      <label className={style.label} onClick={changeStatus}>
        {label}
      </label>
    </div>
  );
};
