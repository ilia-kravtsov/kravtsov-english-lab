import style from '@/pages/writing/ui/Writing.module.scss';

export function Settings() {
  return (
    <section className={style.container}>
      <h1 className={style.header}>
        Settings
      </h1>
      <p className={style.paragraph}>
        This section allows you to customize your learning experience
      </p>
      <p className={style.paragraph}>
        Here you will
        be able to manage your account preferences, interface options, learning
        settings, and other configuration parameters that help adapt the platform
        to your personal study style
      </p>
    </section>
  );
}
