import Session from '@/Session';

export default async function Home() {
  const session = await Session.get();

  if (!session) {
    return 'Welcome!';
  }

  return 'Dashboard!';
}
