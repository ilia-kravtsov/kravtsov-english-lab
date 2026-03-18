import type { CSSProperties, ReactNode } from 'react';

import { Button } from '@/shared/ui';

import style from './AddLexicalUnitForm.module.scss';

type Props = {
  items: string[];
  count: number;
  onAdd: () => void;
  onRemove: (index: number) => void;
  addButtonStyle: CSSProperties;
  getKey: (index: number) => string | number;
  renderField: (index: number) => ReactNode;
};

export function DynamicListField({
  items,
  count,
  onAdd,
  onRemove,
  addButtonStyle,
  getKey,
  renderField,
}: Props) {
  return (
    <div className={style.examplesList}>
      {items.map((_, index) => (
        <div key={getKey(index)} className={style.examplesRow}>
          {renderField(index)}

          <div className={style.examplesActions}>
            {count < 5 && index === count - 1 && (
              <Button type={'button'} title={'+'} onClick={onAdd} style={addButtonStyle} />
            )}

            {count > 1 && (
              <Button
                type={'button'}
                title={'🗑'}
                onClick={() => onRemove(index)}
                style={addButtonStyle}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
