import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RIB CENTER — Rahmat Ichwan Bahtiar',
    short_name: 'RIB CENTER',
    description:
      'Platform Informasi, Rekam Kerja, dan Saluran Aspirasi Rahmat Ichwan Bahtiar',
    start_url: '/',
    display: 'standalone',
    background_color: '#191919',
    theme_color: '#AF191A',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
