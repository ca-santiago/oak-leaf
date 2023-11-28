import { getSession } from "@auth0/nextjs-auth0";

const LoginButton = async () => {
  const session = await getSession();

  if (!session) return <a href="/api/auth/login">Login</a>;

  const { user } = session;

  return (
    <div>
      <div>{user.name}</div>
      <div>{user.email}</div>
      <a href="/api/auth/logout">Logout</a>
    </div>
  );
};

export default LoginButton;
