import type { ComponentProps } from 'react';

import { Input } from '@/shared/ui/Input/Input.tsx';

import style from './AddLexicalUnitForm.module.scss';

type Props = {
  imagePreviewSrc: string | null;
  imageUrlInputProps: ComponentProps<typeof Input>;
};

export function ImageField({ imagePreviewSrc, imageUrlInputProps }: Props) {
  return (
    <div className={style.imageContainer}>
      {imagePreviewSrc && (
        <div className={style.imagePreview}>
          <img className={style.imagePreviewImage} src={imagePreviewSrc} alt={'lexical unit image'} />
        </div>
      )}

      <Input {...imageUrlInputProps} placeholder={'image link https://...'} />
    </div>
  );
}