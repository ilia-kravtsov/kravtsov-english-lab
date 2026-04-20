import type { CardWithLexicalUnit } from '@/entities/card/model/card.types';

import style from './StandardPractice.module.scss';

type Unit = CardWithLexicalUnit['lexicalUnit'];

type Props = {
  unit: Unit | null | undefined;
  hasBackContent: boolean;
};

export function StandardPracticeBack({ unit, hasBackContent }: Props) {
  return (
    <div className={style.cardFaceBack}>
      <div className={style.backContent}>
        {unit?.translation && (
          <div className={style.backRow}>
            <div className={style.backValue}>
              Translation: {unit.translation}
            </div>
          </div>
        )}

        {!!unit?.synonyms?.length && (
          <div className={style.backRow}>
            <div className={style.backValue}>{unit.synonyms.join(', ')}</div>
          </div>
        )}

        {unit?.meaning && (
          <div className={style.backRow}>
            <div className={style.backValue}>
              Meaning: {unit.meaning}
            </div>
          </div>
        )}

        {Array.isArray(unit?.examples) && unit.examples.length > 0 && (
          <div className={style.backRow}>
            <div className={style.backValue}>
              Value:
              {unit.examples.map((example, index) => (
                <span key={index}> {example}</span>
              ))}
            </div>
          </div>
        )}

        {!hasBackContent && <div className={style.muted}>No details</div>}
      </div>
    </div>
  );
}
