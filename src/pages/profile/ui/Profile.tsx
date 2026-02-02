import { useUserStore } from "@/entities/user";

export function Profile() {
  const user = useUserStore(s => s.user);

  if (!user) return <div>Loading user...</div>;

  return (
    <div>
      <h1>ProfilePage</h1>
      <p>First name: {user.firstName}</p>
      <p>Last name: {user.lastName}</p>
    </div>
  );
}