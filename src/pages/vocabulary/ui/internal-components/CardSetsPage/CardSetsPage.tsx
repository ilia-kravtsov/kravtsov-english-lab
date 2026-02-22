import { useNavigate, useParams } from 'react-router-dom';

import style from './CardSetsPage.module.scss';
import { Button } from '@/shared/ui';
import { useCardSetsPage } from '@/features/vocabulary/card-sets/model/useCardSetsPage';
import { LexicalUnitSearchPanel } from '@/features/vocabulary/lexical-unit-add/ui/LexicalUnitSearchPanel/LexicalUnitSearchPanel';

export function CardSetsPage() {
  const { cardSetId } = useParams<{ cardSetId: string }>();
  const navigate = useNavigate();

  const { lexicalSearch, cards, cardsLoading, inSet, adding, addToSet } = useCardSetsPage(cardSetId);

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
            variant={'compact'}
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
              {cards.map(c => (
                <div key={c.id} className={style.cardItem}>
                  <div className={style.cardLexicalId}>{c.lexicalUnitId}</div>
                  {c.note && <div className={style.cardNote}>{c.note}</div>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}