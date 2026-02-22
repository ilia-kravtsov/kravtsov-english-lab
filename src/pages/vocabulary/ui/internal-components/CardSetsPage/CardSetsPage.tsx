import { useNavigate, useParams } from 'react-router-dom';

import style from './CardSetsPage.module.scss';
import { Button, ConfirmModal } from '@/shared/ui';
import { useCardSetsPage } from '@/features/vocabulary/card-sets/model/useCardSetsPage';
import { LexicalUnitSearchPanel } from '@/features/vocabulary/lexical-unit-add/ui/LexicalUnitSearchPanel/LexicalUnitSearchPanel';

export function CardSetsPage() {
  const { cardSetId } = useParams<{ cardSetId: string }>();
  const navigate = useNavigate();

  const {
    lexicalSearch,

    cards,
    cardsLoading,

    inSet,
    adding,
    addToSet,

    removeTarget,
    removing,
    requestRemove,
    cancelRemove,
    confirmRemove,
  } = useCardSetsPage(cardSetId);

  return (
    <div className={style.container}>
      <div className={style.headerRow}>
        <Button
          title={'Back'}
          onClick={() => navigate('/vocabulary/cards')}
          style={{ width: '200px' }}
        />
        <h2 className={style.title}>Card Set</h2>
      </div>

      <div className={style.contentContainer}>
        <div className={style.left}>
          <LexicalUnitSearchPanel
            query={lexicalSearch.query}
            setQuery={lexicalSearch.setQuery}
            normalizedQuery={lexicalSearch.normalizedQuery}
            result={lexicalSearch.result}
            runSearch={lexicalSearch.runSearch}
            audioRef={lexicalSearch.audioRef}
            audioSrc={lexicalSearch.audioSrc}
            playAudio={lexicalSearch.playAudio}
            imageSrc={lexicalSearch.imageSrc}
            variant={'full'}
            renderNotFound={() => (
              <div className={style.hint}>Not found in your words bank.</div>
            )}
            renderFoundActions={() => (
              <Button
                type={'button'}
                title={inSet ? 'Already added' : adding ? 'Adding...' : 'Add'}
                disabled={adding || inSet}
                onClick={() => void addToSet()}
                style={{ width: '140px' }}
              />
            )}
          />
        </div>

        <div className={style.right}>
          <div className={style.cardsHeader}>
            <h3 className={style.cardsTitle}>Cards in set</h3>
            {cardsLoading && <div className={style.muted}>Loading…</div>}
          </div>

          {!cardsLoading && cards.length === 0 && (
            <div className={style.muted}>No cards yet</div>
          )}

          {!cardsLoading && cards.length > 0 && (
            <div className={style.cardsList}>
              {cards.map(c => {
                const value = c.lexicalUnit?.value ?? c.lexicalUnitId;

                return (
                  <div key={c.id} className={style.cardItem}>
                    <button
                      type="button"
                      className={style.removeBtn}
                      onClick={() => requestRemove(c)}
                      aria-label={"Remove from set"}
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
        </div>
      </div>

      <ConfirmModal
        isOpen={removeTarget != null}
        title={'Remove lexical unit from set?'}
        message={
          removeTarget?.lexicalUnit?.value
            ? `Remove "${removeTarget.lexicalUnit.value}" from this set?`
            : 'Remove this item from this set?'
        }
        onCancel={cancelRemove}
        onConfirm={() => void confirmRemove()}
      />
    </div>
  );
}