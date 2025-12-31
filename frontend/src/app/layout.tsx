import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { NavbarWrapper } from '@/components/NavbarWrapper';
import { HeaderScript } from '@/components/HeaderScript';
import { MainContent } from '@/components/MainContent';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Clap Comic - Đọc Truyện Tranh Online',
  description: 'Website đọc truyện tranh online miễn phí',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <HeaderScript />
        <Providers>
          <NavbarWrapper />
          <MainContent>{children}</MainContent>
        </Providers>
      </body>
    </html>
  );
}
