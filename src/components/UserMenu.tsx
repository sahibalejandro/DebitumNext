import type Session from '@/Session';

type Props = React.ComponentProps<'div'> & {
  user?: Session['user'];
};

export default function UserMenu({ user, ...intrinsicAttributes }: Props) {
  return (
    <div {...intrinsicAttributes} data-testid="UserMenu">
      {!user ? (
        <a href="/api/auth/login" data-testid="login-link">
          Login
        </a>
      ) : (
        <div className="flex items-center gap-4">
          <img
            src={user.picture}
            className="rounded-full"
            width="32"
            height="32"
            alt="User Picture"
          />
          <span data-testid="user-name">{user.name}</span>
          <a href="/api/auth/logout" data-testid="logout-link">
            Logout
          </a>
        </div>
      )}
    </div>
  );
}
