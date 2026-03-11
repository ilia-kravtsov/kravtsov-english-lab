import { NavLink } from 'react-router-dom';

import { dashboardSections } from '@/shared/config/dashboardSections';

import style from './Home.module.scss';

export function Home() {
  return (
    <section className={style.container}>
      <div className={style.hero}>
        <div className={style.badge}>English learning platform</div>

        <h1 className={style.header}>Welcome to <div>Kravtsov English Lab</div></h1>

        <p className={style.lead}>
          Improve your English through vocabulary practice, speaking exercises, and
          interactive learning tools.
        </p>

        <div className={style.divider} />

        <div className={style.content}>
          <p className={style.paragraph}>
            You can create your own vocabulary sets, practice words using different
            training modes, and reinforce your knowledge through repetition.
          </p>

          <p className={style.paragraph}>
            Choose a section from the menu to start learning and build your personal
            English knowledge base.
          </p>
        </div>

        <ul className={style.cards}>
          {dashboardSections.map((section) => (
            <li key={section.id} className={style.cardItem}>
              <NavLink to={section.to} className={style.card}>
                <h2 className={style.cardTitle}>{section.title}</h2>
                <p className={style.cardText}>{section.description}</p>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}