import style from './DailyPractice.module.scss';

export function DailyPractice() {
  return (
    <section className={style.container}>
      <h1 className={style.header}>Daily Practice</h1>
      <p className={style.paragraph}>
        This section is designed to help you practice English every day with short, focused
        exercises
      </p>
      <p className={style.paragraph}>
        Here you will complete daily tasks that combine vocabulary, grammar, reading, listening, and
        speaking activities
      </p>
      <p className={style.paragraph}>
        The goal is to build a consistent learning habit and steadily improve your language skills
        through small but regular practice sessions
      </p>
    </section>
  );
}
