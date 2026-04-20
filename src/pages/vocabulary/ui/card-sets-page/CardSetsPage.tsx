import { useNavigate, useParams } from 'react-router-dom';

import { useCardSetsPage } from '@/features/vocabulary/card-sets/model/use-card-sets-page';
import { LexicalUnitSearchPanel } from '@/features/vocabulary/lexical-unit-add/ui/lexical-unit-search-panel/LexicalUnitSearchPanel';
import { CardSetsPageHeader } from '@/pages/vocabulary/ui/card-sets-page/card-sets-page-header/CardSetsPageHeader';
import { CardSetsCardsList } from '@/pages/vocabulary/ui/card-sets-page/CardSetsCardsList';
import { CardSetsSearchActions } from '@/pages/vocabulary/ui/card-sets-page/CardSetsSearchActions';
import { ConfirmModal, LinkAsButton } from '@/shared/ui';

import style from './CardSetsPage.module.scss';

export function CardSetsPage() {
  const { cardSetId } = useParams<{ cardSetId: string }>();
  const navigate = useNavigate();

  const {
    cardSet,
    cardSetLoading,

    lexicalSearch,
    cards,
    cardsLoading,

    inSet,
    foundCardInSet,
    adding,
    addToSet,

    removeTarget,
    removing,
    requestRemove,
    cancelRemove,
    confirmRemove,
  } = useCardSetsPage(cardSetId);

  const cardsShorterAmount = cards.slice(0, 30);
  const pageTitle = cardSetLoading ? '' : (cardSet?.title ?? '');

  const removeModalMessage = removeTarget?.lexicalUnit?.value
    ? `Remove "${removeTarget.lexicalUnit.value}" from this set?`
    : 'Remove this item from this set?';

  const onBackClick = () => {
    navigate('/vocabulary/cards');
  };

  const onAddClick = () => {
    void addToSet();
  };

  const onRemoveFoundClick = () => {
    if (!foundCardInSet) return;
    requestRemove(foundCardInSet);
  };

  const onConfirmRemove = () => {
    void confirmRemove();
  };

  const renderNotFound = () => {
    return <div className={style.hint}>Not found in your words bank.</div>;
  };

  const renderFoundActions = () => {
    return (
      <CardSetsSearchActions
        inSet={inSet}
        adding={adding}
        removing={removing}
        hasFoundCardInSet={!!foundCardInSet}
        onAdd={onAddClick}
        onRemove={onRemoveFoundClick}
      />
    );
  };

  return (
    <div className={style.container}>
      <CardSetsPageHeader
        title={pageTitle}
        onBackClick={onBackClick}
      >
        {cardSetId && (
          <LinkAsButton to={`/vocabulary/cards/${cardSetId}/practice`}>
            Practice
          </LinkAsButton>
        )}
      </CardSetsPageHeader>

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
            renderNotFound={renderNotFound}
            renderFoundActions={renderFoundActions}
          />
        </div>

        <div className={style.right}>
          <CardSetsCardsList
            cards={cardsShorterAmount}
            cardsLoading={cardsLoading}
            removing={removing}
            onRequestRemove={requestRemove}
          />
        </div>
      </div>

      <ConfirmModal
        isOpen={removeTarget != null}
        title={'Remove lexical unit from set?'}
        message={removeModalMessage}
        onCancel={cancelRemove}
        onConfirm={onConfirmRemove}
      />
    </div>
  );
}
