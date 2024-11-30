import { getSession } from '@auth0/nextjs-auth0';

export default async function Home() {
  const session = await getSession();

  return (
    <>
      Hello World!
      {session?.user ? (
        <a href="/api/auth/logout">Logout {session?.user.name}</a>
      ) : (
        <a href="/api/auth/login">Login</a>
      )}
    </>
  );
}
