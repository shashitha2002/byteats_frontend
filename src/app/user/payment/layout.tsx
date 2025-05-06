// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Payment Processing App',
  description: 'A simple payment processing application using Stripe',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <header>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}