import style from "./ConfirmModal.module.scss";
import { Button } from "@/shared/ui/Button/Button";

interface Props {
  isOpen: boolean;
  title: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }: Props) {
  if (!isOpen) return null;

  return (
    <div className={`${style.overlay} ${isOpen ? style.open : ''}`}>
      <div className={`${style.modal} ${isOpen ? style.open : ''}`}>
        <h3 className={style.title}>{title}</h3>
        {message && <p className={style.paragraph}>{message}</p>}
        <div className={style.actions}>
          <Button title="Cancel" onClick={onCancel} />
          <Button title="Confirm" onClick={onConfirm} />
        </div>
      </div>
    </div>
  );
}
