import Link from 'next/link';

export default function Dashboard() {
  return (
    <>
      <div>Dashboard!</div>
      <Link href="/payments/create" data-testid="link-create-payment">
        New Payment
      </Link>
    </>
  );
}
