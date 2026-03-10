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

        <div className={style.cards}>
          <article className={style.card}>
            <span className={style.cardIndex}>01</span>
            <h2 className={style.cardTitle}>Build vocabulary</h2>
            <p className={style.cardText}>
              Create your own word bank and organize it into convenient study sets.
            </p>
          </article>

          <article className={style.card}>
            <span className={style.cardIndex}>02</span>
            <h2 className={style.cardTitle}>Practice actively</h2>
            <p className={style.cardText}>
              Train with different exercise modes designed for repetition and retention.
            </p>
          </article>

          <article className={style.card}>
            <span className={style.cardIndex}>03</span>
            <h2 className={style.cardTitle}>Speak with confidence</h2>
            <p className={style.cardText}>
              Develop fluency and feel more natural when communicating in English.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}