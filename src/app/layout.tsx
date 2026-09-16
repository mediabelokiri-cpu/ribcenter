import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { StructuredData } from '@/components/seo/structured-data';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#191919',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'RIB CENTER | Platform Informasi & Akuntabilitas Publik Rahmat Ichwan Bahtiar',
    template: '%s | RIB CENTER',
  },
  description:
    'Platform resmi informasi publik, rekam kerja, transparansi kebijakan daerah, dan kanal partisipasi aspirasi warga bersama Rahmat Ichwan Bahtiar.',
  keywords: [
    'Rahmat Ichwan Bahtiar',
    'RIB CENTER',
    'Kalimantan Timur',
    'Rekam Kerja',
    'Akuntabilitas Publik',
    'Transparansi Kebijakan',
    'Aspirasi Warga',
  ],
  authors: [{ name: 'Rahmat Ichwan Bahtiar' }],
  creator: 'Tim Kerja RIB CENTER',
  publisher: 'RIB CENTER',
  icons: {
    icon: [
      { url: '/icon.png', sizes: 'any' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/icon.png',
    apple: '/icon.png',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: siteUrl,
    siteName: 'RIB CENTER — Rahmat Ichwan Bahtiar',
    title: 'RIB CENTER | Platform Informasi & Akuntabilitas Publik Rahmat Ichwan Bahtiar',
    description:
      'Platform resmi informasi publik, rekam kerja, transparansi kebijakan daerah, dan kanal partisipasi aspirasi warga bersama Rahmat Ichwan Bahtiar.',
    images: [
      {
        url: '/rahmat-hero.png',
        width: 1200,
        height: 630,
        alt: 'Rahmat Ichwan Bahtiar — RIB CENTER',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RIB CENTER | Platform Informasi & Akuntabilitas Publik Rahmat Ichwan Bahtiar',
    description:
      'Platform resmi informasi publik, rekam kerja, transparansi kebijakan daerah, dan kanal partisipasi aspirasi warga bersama Rahmat Ichwan Bahtiar.',
    images: ['/rahmat-hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const rootWebsiteJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteUrl}/#website`,
      url: siteUrl,
      name: 'RIB CENTER — Rahmat Ichwan Bahtiar',
      description:
        'Platform resmi informasi publik, rekam kerja, transparansi kebijakan daerah, dan kanal partisipasi aspirasi warga bersama Rahmat Ichwan Bahtiar.',
      inLanguage: 'id-ID',
    },
    {
      '@type': 'Person',
      '@id': `${siteUrl}/#person`,
      name: 'Rahmat Ichwan Bahtiar',
      url: siteUrl,
      jobTitle: 'Tokoh Publik & Perwakilan Warga',
      sameAs: [
        'https://instagram.com/rahmatichwanbahtiar',
      ],
    },
  ],
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
      <body className="min-h-full flex flex-col font-sans bg-white text-[#191919] antialiased">
        <StructuredData data={rootWebsiteJsonLd} />
        {children}
      </body>
    </html>
  );
}
