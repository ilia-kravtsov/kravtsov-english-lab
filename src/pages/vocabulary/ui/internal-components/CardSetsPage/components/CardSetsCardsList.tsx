import type { CardWithLexicalUnit } from '@/entities/card/model/card.types.ts';

import style from '../CardSetsPage.module.scss';

type Props = {
  cards: CardWithLexicalUnit[];
  cardsLoading: boolean;
  removing: boolean;
  onRequestRemove: (card: CardWithLexicalUnit) => void;
};

export function CardSetsCardsList({
                                    cards,
                                    cardsLoading,
                                    removing,
                                    onRequestRemove,
                                  }: Props) {
  const hasCards = cards.length > 0;
  const isEmptyCards = !cardsLoading && !hasCards;

  return (
    <>
      <div className={style.cardsHeader}>
        <h3 className={style.cardsTitle}>First 30 cards in set</h3>
        {cardsLoading && <div className={style.muted}>Loading…</div>}
      </div>

      {isEmptyCards && <div className={style.muted}>No cards yet</div>}

      {hasCards && (
        <div className={style.cardsList}>
          {cards.map((c) => {
            const value = c.lexicalUnit?.value ?? c.lexicalUnitId;

            return (
              <div key={c.id} className={style.cardItem}>
                <button
                  type="button"
                  className={style.removeBtn}
                  onClick={() => onRequestRemove(c)}
                  aria-label={'Remove from set'}
                  disabled={removing}
                >
                  ×
                </button>

                <div className={style.cardTopRow}>
                  <div className={style.cardValue}>{value}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}