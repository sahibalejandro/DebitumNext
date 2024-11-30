import Link from 'next/link';
import type { Metadata } from 'next';
import { getSession } from '@auth0/nextjs-auth0';
import { UserProvider } from '@auth0/nextjs-auth0/client';

import UserMenu from '@/components/UserMenu';

import './globals.css';

export const metadata: Metadata = {
  title: 'Debitum',
  description: 'Never miss a payment',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html lang="en">
      <UserProvider>
        <body>
          <nav className="bg-slate-900 text-slate-50">
            <div className="container flex justify-between mx-auto p-4">
              <Link href="/">Debitum</Link>
              <UserMenu user={session?.user} />
            </div>
          </nav>
          <main className="container mx-auto px-4">{children}</main>
        </body>
      </UserProvider>
    </html>
  );
}
