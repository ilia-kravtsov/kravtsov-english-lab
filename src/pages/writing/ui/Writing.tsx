import style from './Writing.module.scss';

export function Writing() {
  return (
    <section className={style.container}>
      <h1 className={style.header}>
        Writing
      </h1>
      <p className={style.paragraph}>
        This section will help you develop your English writing skills
      </p>
      <p className={style.paragraph}>
        You will work with different tasks such as sentence building, short messages, descriptions,
        and longer texts
      </p>
      <p className={style.paragraph}>
        Exercises will focus on grammar accuracy, vocabulary usage,
        and clear expression so you can write confidently in everyday situations
      </p>
    </section>
  );
}
