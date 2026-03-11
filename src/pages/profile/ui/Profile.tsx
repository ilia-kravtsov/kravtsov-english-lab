import { useUserStore } from '@/features/auth/user';

import style from './Profile.module.scss';

export function Profile() {
  const user = useUserStore((s) => s.user);

  if (!user) return <div>Loading user...</div>;

  return (
    <div className={style.container}>
      <h1 className={style.header}>ProfilePage</h1>
      <div className={style.contentContainer}>
        <div className={style.personalInfoContainer}>
          <p>First name: {user.firstName}</p>
          <p>Last name: {user.lastName}</p>
          <p>Email: {user.email}</p>
        </div>
        <div className={style.descriptionContainer}>
          <p className={style.paragraph}>
            This section shows information about your learning progress and personal activity on the
            platform
          </p>
          <p className={style.paragraph}>
            Here you will be able to track statistics, achievements, completed exercises, and
            overall progress in learning English as you continue practicing
          </p>
        </div>
      </div>
    </div>
  );
}
