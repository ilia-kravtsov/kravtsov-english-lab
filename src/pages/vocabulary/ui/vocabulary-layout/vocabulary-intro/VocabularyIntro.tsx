import { NavLink } from 'react-router-dom';

import { LinkAsButton } from '@/shared/ui';

import style from './VocabularyIntro.module.scss';

export function VocabularyIntro() {
  return (
    <div className={style.container}>
      <h2 className={style.title}>Vocabulary</h2>

      <div className={style.paragraphContainer}>
        <p className={style.paragraph}>
          This section helps you manage and practice your vocabulary
        </p>
        <p className={style.paragraph}>
          To get started, choose one of the options from the menu above
        </p>
        <p className={style.paragraph}>
          <NavLink to={"cards"}>Cards — </NavLink>
          ready-made sets of cards organized by difficulty level. Create your own cards for
          personalized practice
        </p>
        <p className={style.paragraph}>
          <NavLink to={"words-bank"}>Words bank — </NavLink>
          save unfamiliar words and new expressions for later review and future practice
        </p>
      </div>

      <LinkAsButton to={"cards"}>Let's dive in!</LinkAsButton>
    </div>
  );
}
