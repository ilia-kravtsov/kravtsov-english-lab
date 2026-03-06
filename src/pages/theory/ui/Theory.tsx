import style from '@/pages/writing/ui/Writing.module.scss';

export function Theory() {
  return (
    <section className={style.container}>
      <h1 className={style.header}>Theory</h1>
      <p className={style.paragraph}>
        This section contains explanations of grammar rules, language structures, and useful
        learning materials
      </p>
      <p className={style.paragraph}>
        Here you will find clear theoretical guides that support the practical exercises in other
        sections
      </p>
      <p className={style.paragraph}>
        It is a place to review concepts and better understand how English works
      </p>
    </section>
  );
}
