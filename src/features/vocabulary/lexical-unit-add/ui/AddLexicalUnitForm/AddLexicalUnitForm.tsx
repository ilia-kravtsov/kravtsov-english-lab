import { Controller } from 'react-hook-form';

import { useAddLexicalUnitForm } from '@/features/vocabulary/lexical-unit-add/model/useAddLexicalUnitForm/useAddLexicalUnitForm.ts';
import { AudioField } from '@/features/vocabulary/lexical-unit-add/ui/AddLexicalUnitForm/components/AudioField.tsx';
import { Button, Textarea } from '@/shared/ui';
import { Input } from '@/shared/ui/Input/Input';
import { MultiSelect } from '@/shared/ui/MultiSelect/MultiSelect';

import style from './AddLexicalUnitForm.module.scss';
import { ImageField } from '@/features/vocabulary/lexical-unit-add/ui/AddLexicalUnitForm/components/ImageField.tsx';
import {
  DynamicListField
} from '@/features/vocabulary/lexical-unit-add/ui/AddLexicalUnitForm/components/DynamicListField.tsx';

export function AddLexicalUnitForm() {
  const {
    register,
    submit,
    mode,
    submitting,

    partsOptions,
    control,

    mainAudio,
    meaningAudio,
    exampleAudio,

    imagePreviewSrc,

    examples,
    examplesCount,
    addExample,
    removeExample,

    synonyms,
    synonymsCount,
    addSynonym,
    removeSynonym,

    antonyms,
    antonymsCount,
    addAntonym,
    removeAntonym,
  } = useAddLexicalUnitForm();

  const stylesLargeButton = { width: '160px', fontSize: '16px' };
  const stylesBigButton = { minWidth: '144px' };
  const stylesMediumButton = { minWidth: '56px' };
  const stylesSmallButton = { minWidth: '44px' };

  return (
    <form onSubmit={submit} className={style.container}>
      <Input {...register('value', { required: true })} placeholder={'word or expression *'} />
      <Input {...register('translation')} placeholder={'translation *'} />

      <AudioField
        audio={mainAudio}
        idleTitle={'Record a Sound'}
        recordingTitle={'Stop Recording'}
        recordButtonStyle={stylesBigButton}
        actionButtonStyle={stylesMediumButton}
      />

      <AudioField
        audio={meaningAudio}
        idleTitle={'Record Meaning'}
        recordingTitle={'Stop Meaning'}
        recordButtonStyle={stylesBigButton}
        actionButtonStyle={stylesMediumButton}
      />

      <AudioField
        audio={exampleAudio}
        idleTitle={'Record Example'}
        recordingTitle={'Stop Example'}
        recordButtonStyle={stylesBigButton}
        actionButtonStyle={stylesMediumButton}
      />

      <Input {...register('transcription')} placeholder={'transcription'} />
      <Textarea {...register('meaning')} placeholder={'meaning in English'} />

      <ImageField
        imagePreviewSrc={imagePreviewSrc}
        imageUrlInputProps={register('imageUrl')}
      />

      <Controller
        control={control}
        name={'partsOfSpeech'}
        render={({ field }) => (
          <MultiSelect
            value={field.value ?? []}
            onChange={field.onChange}
            options={partsOptions}
            placeholder={'parts of speech'}
          />
        )}
      />

      <DynamicListField
        items={synonyms}
        count={synonymsCount}
        onAdd={addSynonym}
        onRemove={removeSynonym}
        addButtonStyle={stylesSmallButton}
        getKey={(index) => `syn-${index}`}
        renderField={(index) => (
          <Input
            {...register(`synonyms.${index}` as const)}
            placeholder={index === 0 ? 'synonym' : `synonym ${index + 1}`}
          />
        )}
      />

      <DynamicListField
        items={antonyms}
        count={antonymsCount}
        onAdd={addAntonym}
        onRemove={removeAntonym}
        addButtonStyle={stylesSmallButton}
        getKey={(index) => `ant-${index}`}
        renderField={(index) => (
          <Input
            {...register(`antonyms.${index}` as const)}
            placeholder={index === 0 ? 'antonym' : `antonym ${index + 1}`}
          />
        )}
      />

      <DynamicListField
        items={examples}
        count={examplesCount}
        onAdd={addExample}
        onRemove={removeExample}
        addButtonStyle={stylesSmallButton}
        getKey={(index) => index}
        renderField={(index) => (
          <Textarea
            {...register(`examples.${index}` as const)}
            placeholder={index === 0 ? 'example' : `example ${index + 1}`}
            rows={2}
          />
        )}
      />

      <Textarea {...register('comment')} placeholder={'comment'} />
      <Button
        type={'submit'}
        disabled={submitting}
        title={
          submitting
            ? mode === 'update'
              ? 'Updating...'
              : 'Saving...'
            : mode === 'update'
              ? 'Update'
              : 'Save'
        }
        style={stylesLargeButton}
      />
    </form>
  );
}
