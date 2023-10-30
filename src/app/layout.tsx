import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { WrappedToast } from '@/components/Elements/Toast';
import { ReduxProvider } from '@/stores/ReduxProvider';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WrappedToast />
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
