import style from '@/pages/writing/ui/Writing.module.scss';

export function Rating() {
  return (
    <section className={style.container}>
      <h1 className={style.header}>Rating</h1>
      <p className={style.paragraph}>
        This section displays rankings and progress comparisons between learners
      </p>
      <p className={style.paragraph}>
        You will be able to see your position in leaderboards, track achievements, and measure your
        activity against other users
      </p>
      <p className={style.paragraph}>
        The rating system is designed to add motivation and encourage consistent learning
      </p>
    </section>
  );
}
