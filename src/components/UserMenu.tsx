import type { Claims } from '@auth0/nextjs-auth0';

type Props = React.ComponentProps<'div'> & {
  user?: Claims;
};

export default function UserMenu({ user, ...intrinsicAttributes }: Props) {
  return (
    <div {...intrinsicAttributes}>
      {!user ? (
        <a href="/api/auth/login" data-testid="link-login">
          Login
        </a>
      ) : (
        <>
          <span data-testid="user-name">{user.name}</span> -{' '}
          <a href="/api/auth/logout" data-testid="link-logout">
            Logout
          </a>
        </>
      )}
    </div>
  );
}
