import Session from '@/Session';
import Dashboard from '@/components/Dashboard';

export default async function Home() {
  const session = await Session.get();

  if (!session) {
    return 'Welcome!';
  }

  return <Dashboard />;
}
