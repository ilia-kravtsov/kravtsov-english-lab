import { v4 } from 'uuid';
import styles from './Checkbox.module.scss'

interface Props {
  size?: number
  label?: string
  checked?: string | boolean;
  onChange?: (checked: boolean) => void;
}

export const CustomCheckbox = ({ size = 24, label, checked = false,  onChange}: Props) => {
  const checkBoxId = `checkbox_id_${v4()}`;

  const checkBoxSize = {
    width: size,
    height: size
  }

  const checkBoxClassNames = `${styles.innerSquare} ${checked ? styles.checked : ''}`

  const changeStatus = () => {
    onChange?.(!checked);
  }

  return (
    <div className={styles.container}>
      <div className={styles.checkbox}
           id={checkBoxId}
           onClick={changeStatus}
           style={checkBoxSize}
      >
        <div className={checkBoxClassNames} />
      </div>
      <label className={styles.label}
             htmlFor={checkBoxId}
             onClick={changeStatus}
      >
        {label}
      </label>
    </div>
  )
}