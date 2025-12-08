import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Virtual Goods Shop',
  description: 'Best virtual items for your adventures',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50 text-gray-900 antialiased`} suppressHydrationWarning>
        <main className="min-h-screen pb-20">
          {children}
        </main>
      </body>
    </html>
  );
}
