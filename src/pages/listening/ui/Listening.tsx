import style from './Listening.module.scss';

export function Listening() {
  return (
    <section className={style.container}>
      <h1 className={style.header}>Listening</h1>
      <p className={style.paragraph}>
        This section will train your ability to understand spoken English
      </p>
      <p className={style.paragraph}>
        You will listen to dialogues, phrases, and short stories with different accents and speeds
      </p>
      <p className={style.paragraph}>
        Exercises will help you improve comprehension, recognize common expressions, and become more
        comfortable understanding natural speech
      </p>
    </section>
  );
}
