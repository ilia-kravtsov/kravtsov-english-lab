import style from './About.module.scss';

export function About() {
  return (
    <section className={style.container}>
      <h1 className={style.header}>About</h1>

      <p className={style.paragraph}>
        Kravtsov English Lab is an English learning platform created to make practice more clear,
        structured, and engaging for learners at different stages.
      </p>

      <p className={style.paragraph}>
        The platform combines vocabulary training, reading, listening, speaking, and writing so you
        can improve several language skills in one place and build steady learning habits.
      </p>

      <p className={style.paragraph}>
        Its goal is to provide a convenient environment where users can practise regularly, track
        progress, and develop confidence in real everyday English.
      </p>
    </section>
  );
}