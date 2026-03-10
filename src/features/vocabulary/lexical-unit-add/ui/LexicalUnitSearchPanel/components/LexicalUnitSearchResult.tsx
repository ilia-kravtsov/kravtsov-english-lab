import type { ReactNode, RefObject } from 'react';

import type { LexicalUnit } from '@/entities/lexical-unit';

import style from '../LexicalUnitSearchPanel.module.scss';
import { LexicalUnitSearchAudio } from './LexicalUnitSearchAudio';

type Props = {
  unit: LexicalUnit;
  variant?: 'full' | 'compact';

  audioRef?: RefObject<HTMLAudioElement | null>;
  audioSrc?: string | null;
  playAudio?: () => void;

  meaningAudioRef?: RefObject<HTMLAudioElement | null>;
  meaningAudioSrc?: string | null;
  playMeaningAudio?: () => void;

  exampleAudioRef?: RefObject<HTMLAudioElement | null>;
  exampleAudioSrc?: string | null;
  playExampleAudio?: () => void;

  imageSrc?: string | null;
  renderFoundActions?: (unit: LexicalUnit) => ReactNode;
};

export function LexicalUnitSearchResult({
                                          unit,
                                          variant = 'full',

                                          audioRef,
                                          audioSrc,
                                          playAudio,

                                          meaningAudioRef,
                                          meaningAudioSrc,
                                          playMeaningAudio,

                                          exampleAudioRef,
                                          exampleAudioSrc,
                                          playExampleAudio,

                                          imageSrc,
                                          renderFoundActions,
                                        }: Props) {
  return (
    <div className={style.resultBox}>
      <div className={style.fields}>
        <div className={style.fieldRow}>
          <span className={style.value}>{unit.value}</span>

          {unit.translation && (
            <div className={style.fieldRow}>
              <span className={style.value}>{unit.translation}</span>
            </div>
          )}
        </div>

        <div className={style.fieldRow}>
          {unit.transcription && (
            <div className={style.fieldRow}>
              <span className={style.value}>{unit.transcription}</span>
            </div>
          )}

          {audioSrc && audioRef && playAudio && (
            <LexicalUnitSearchAudio
              audioRef={audioRef}
              audioSrc={audioSrc}
              title={'Play'}
              onPlay={playAudio}
            />
          )}
        </div>

        {variant === 'full' && (
          <>
            {unit.meaning && (
              <div className={style.fieldRow}>
                <span className={style.value}>{unit.meaning}</span>
              </div>
            )}

            {meaningAudioSrc && meaningAudioRef && playMeaningAudio && (
              <LexicalUnitSearchAudio
                audioRef={meaningAudioRef}
                audioSrc={meaningAudioSrc}
                title={'Play meaning'}
                onPlay={playMeaningAudio}
              />
            )}

            {unit.partsOfSpeech?.length ? (
              <div className={style.fieldRow}>
                <span className={style.value}>{unit.partsOfSpeech.join(', ')}</span>
              </div>
            ) : null}

            {unit.synonyms?.length ? <span>{unit.synonyms.join(', ')}</span> : null}
            {unit.antonyms?.length ? <span>{unit.antonyms.join(', ')}</span> : null}

            {unit.examples && (
              <div className={style.fieldBlock}>
                <div className={style.label}>Examples:</div>
                <div className={style.value}>
                  {Array.isArray(unit.examples) ? unit.examples.join(', ') : unit.examples}
                </div>
              </div>
            )}

            {exampleAudioSrc && exampleAudioRef && playExampleAudio && (
              <LexicalUnitSearchAudio
                audioRef={exampleAudioRef}
                audioSrc={exampleAudioSrc}
                title={'Play example'}
                onPlay={playExampleAudio}
              />
            )}

            {unit.comment && (
              <div className={style.fieldBlock}>
                <div className={style.value}>{unit.comment}</div>
              </div>
            )}
          </>
        )}
      </div>

      {variant === 'full' && imageSrc && (
        <div className={style.imageBox}>
          <img className={style.imageBoxImage} src={imageSrc} alt={unit.value} />
        </div>
      )}

      {renderFoundActions && <div className={style.actions}>{renderFoundActions(unit)}</div>}
    </div>
  );
}