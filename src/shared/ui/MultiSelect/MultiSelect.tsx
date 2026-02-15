import { useMemo, useRef, useState } from 'react';
import style from './MultiSelect.module.scss';
import type { PartsOfSpeech } from '@/entities/lexical-unit';

type Option = { value: PartsOfSpeech; label: string };

interface Props {
  value: PartsOfSpeech[];
  onChange: (next: PartsOfSpeech[]) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
}

export function MultiSelect({ value, onChange, options, placeholder, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const selectedSet = useMemo(() => new Set<PartsOfSpeech>(value), [value]);

  const toggle = (v: PartsOfSpeech) => {
    if (disabled) return;

    const next = selectedSet.has(v)
      ? value.filter(x => x !== v)
      : [...value, v];

    onChange(next);
  };

  const remove = (v: PartsOfSpeech) => {
    if (disabled) return;
    onChange(value.filter(x => x !== v));
  };

  const selectedLabels = useMemo(() => {
    const map = new Map<PartsOfSpeech, string>(options.map(o => [o.value, o.label]));
    return value.map(v => ({ value: v, label: map.get(v) ?? v }));
  }, [value, options]);

  return (
    <div
      ref={rootRef}
      className={`${style.root} ${disabled ? style.disabled : ''}`}
      tabIndex={0}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
    >
      <button
        type={"button"}
        className={style.control}
        onClick={() => !disabled && setOpen(v => !v)}
      >
        <div className={style.valueArea}>
          {selectedLabels.length === 0 ? (
            <span className={style.placeholder}>{placeholder ?? 'Select...'}</span>
          ) : (
            <div className={style.tags}>
              {selectedLabels.map(t => (
                <span key={t.value} className={style.tag}>
                  {t.label}
                  <button
                    type={"button"}
                    className={style.tagRemove}
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(t.value);
                    }}
                    aria-label={`Remove ${t.label}`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </button>

      {open && (
        <div className={style.dropdown}>
          {options.map(opt => {
            const active = selectedSet.has(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className={`${style.option} ${active ? style.optionActive : ''}`}
                onClick={() => toggle(opt.value)}
              >
                <span className={style.checkbox}>{active ? '☑' : '☐'}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
