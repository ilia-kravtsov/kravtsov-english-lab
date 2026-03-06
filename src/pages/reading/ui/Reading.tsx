import style from './Reading.module.scss';

export function Reading() {
  return (
    <section className={style.container}>
      <h1 className={style.header}>
        Reading
      </h1>
      <p className={style.paragraph}>
        This section is designed to improve your reading comprehension
      </p>
      <p className={style.paragraph}>
        You will read texts of different difficulty levels and complete exercises that check your
        understanding of vocabulary, grammar, and context
      </p>
      <p className={style.paragraph}>
        The goal is to help you read faster, understand more, and expand your vocabulary through real examples
      </p>
    </section>
  );
}
