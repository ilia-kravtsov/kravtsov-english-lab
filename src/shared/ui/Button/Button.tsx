import styles from "./Button.module.scss";

interface ButtonProps {
  title: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  type?: 'button' | 'submit';
  height?: number
  width?: number
}

export function Button({
                         title,
                         onClick,
                         disabled = false,
                         type = 'button',
                         height,
                         width,
                       }: ButtonProps) {

  const buttonStyles = {
    height: height && `${height}px`,
    width: width && `${width}px`,
  }

  return (
    <button
      className={styles.button}
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={buttonStyles}
    >
      {title}
    </button>
  );
}