import style from './Contacts.module.scss';

export function Contacts() {
  return (
    <section className={style.container}>
      <h1 className={style.header}>Contacts</h1>

      <p className={style.paragraph}>
        This page contains contact information and ways to get in touch regarding the platform,
        collaboration, or feedback about the learning experience.
      </p>

      <p className={style.paragraph}>
        You can use the contacts section to ask questions, report issues, share suggestions, or
        discuss ideas for improving the project and its educational features.
      </p>

      <div className={style.contactList}>
        <div className={style.contactItem}>
          <span className={style.label}>Phone:</span>
          <a href="tel:+79991800090" className={style.link}>
            +79991800090
          </a>
        </div>

        <div className={style.contactItem}>
          <span className={style.label}>Email:</span>
          <a href="mailto:ilia_kravtsov@vk.com" className={style.link}>
            ilia_kravtsov@vk.com
          </a>
        </div>
      </div>
    </section>
  );
}