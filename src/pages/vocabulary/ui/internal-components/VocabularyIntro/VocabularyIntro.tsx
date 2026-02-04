import style from './VocabularyIntro.module.scss';
import {NavLink} from "react-router-dom";

export function VocabularyIntro() {
  return (
    <div className={style.container}>
      <h2 className={style.title}>Vocabulary</h2>
      <p className={style.paragraph}>
        <span className={style.line}>This section helps you manage and practice your vocabulary</span>
        <span className={style.line}>To get started, choose one of the options from the menu above</span>
      </p>
      <ul className={style.list}>
        <li className={style.item}>
          <p className={style.paragraph}>
            <NavLink to="card-sets">Cards — </NavLink>
            ready-made sets of cards organized by difficulty level
          </p>
          <p className={style.paragraph}>create your own cards for personalized practice</p>
        </li>
        <li className={style.item}>
          <p className={style.paragraph}>
            <NavLink to="words-bank">Words bank — </NavLink>
            save unfamiliar words and new expressions
          </p>
          <p className={style.paragraph}>for later review and future practice</p>
        </li>
      </ul>

      <h3 className={style.subtitle}>Let's dive in!</h3>
    </div>
  );
}
