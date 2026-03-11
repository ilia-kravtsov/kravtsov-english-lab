import { forwardRef, type TextareaHTMLAttributes } from 'react';

import style from './Textarea.module.scss';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, ...props }, ref) => {
    return <textarea ref={ref} className={`${style.container} ${className ?? ''}`} {...props} />;
  },
);
