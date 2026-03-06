import style from './Speaking.module.scss'

export function Speaking() {
  return (
    <section className={style.container}>
      <h1 className={style.header}>
        Speaking
      </h1>
      <p className={style.paragraph}>
        This section focuses on improving your spoken English
      </p>
      <p className={style.paragraph}>
        You will practice pronunciation, repeating phrases, answering questions, and speaking on
        different topics
      </p>
      <p className={style.paragraph}>
        The exercises are designed to help you become more fluent,
        confident, and comfortable when communicating in English
      </p>
    </section>
  );
}
