import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Rahmat Ichwan Bahtiar | Platform Informasi & Akuntabilitas Publik',
  description:
    'Platform Resmi Informasi dan Akuntabilitas Publik Rahmat Ichwan Bahtiar',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-[#191919] antialiased dark:bg-[#191919] dark:text-white">
        {children}
      </body>
    </html>
  );
}
