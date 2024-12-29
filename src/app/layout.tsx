import Link from 'next/link';
import type { Metadata } from 'next';

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
  return (
    <html lang="en">
      <body>
        <nav className="bg-slate-900 text-slate-50">
          <div className="container flex justify-between mx-auto p-4">
            <Link href="/">Debitum</Link>
            {/*<UserMenu user={session?.user} />*/}
          </div>
        </nav>
        <main className="container mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
