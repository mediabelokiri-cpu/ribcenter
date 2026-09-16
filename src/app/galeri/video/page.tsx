import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { getPublishedVideos } from '@/services/media';
import { VideoPlayerModal } from '../video-player-modal';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Video Liputan Lapangan & Dokumentasi | Rahmat Ichwan Bahtiar',
  description:
    'Koleksi video liputan lapangan, dialog konstituen, dan tayangan publikasi resmi Rahmat Ichwan Bahtiar.',
};

export default async function GaleriVideoPage() {
  const videos = await getPublishedVideos();

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      <PublicHeader activeRoute="/galeri" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#AF191A]">Beranda</Link>
          <span>/</span>
          <Link href="/galeri" className="hover:text-[#AF191A]">Galeri</Link>
          <span>/</span>
          <span className="text-[#191919] font-medium">Video Kegiatan</span>
        </nav>

        {/* Page Header */}
        <div className="space-y-2 border-b border-neutral-200 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
            Dokumentasi Bergerak
          </span>
          <h1 className="text-3xl font-black tracking-tight text-[#191919]">
            Koleksi Video Liputan Lapangan
          </h1>
          <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
            Arsip rekaman video kegiatan, peninjauan lapangan, serta pernyataan pers resmi Rahmat Ichwan Bahtiar.
          </p>

          <div className="flex items-center gap-2 pt-3">
            <Link
              href="/galeri"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            >
              &larr; Beranda Galeri
            </Link>
            <Link
              href="/galeri/foto"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            >
              Album Foto
            </Link>
            <Link
              href="/galeri/video"
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#191919] text-white shadow-xs"
            >
              Video Dokumentasi ({videos.length})
            </Link>
          </div>
        </div>

        {/* Video Grid with Player Modal */}
        <VideoPlayerModal videos={videos} />
      </main>

      <PublicFooter />
    </div>
  );
}
