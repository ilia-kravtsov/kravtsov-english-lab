interface ButtonProps {
  title: string;
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  type?: 'button' | 'submit';
}

export function Button({
                         title,
                         onClick,
                         disabled = false,
                         type = 'button',
                       }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} disabled={disabled}>
      {title}
    </button>
  );
}