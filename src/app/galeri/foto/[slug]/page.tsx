import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/public-header';
import { getAlbumBySlug, getMediaByAlbum } from '@/services/media';
import { LightboxViewer } from '../../lightbox-viewer';

export const dynamic = 'force-dynamic';

interface AlbumDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: AlbumDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);

  if (!album || album.status !== 'PUBLISHED') {
    return {
      title: 'Album Tidak Ditemukan | Rahmat Ichwan Bahtiar',
    };
  }

  const title = `${album.title} | Galeri Foto Rahmat Ichwan Bahtiar`;
  const description =
    album.description ||
    `Dokumentasi visual dan album foto kegiatan ${album.title} Rahmat Ichwan Bahtiar.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/galeri/foto/${album.slug}`,
    },
    openGraph: {
      title,
      description,
      type: 'article',
      images: album.cover_image_url ? [{ url: album.cover_image_url }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: album.cover_image_url ? [album.cover_image_url] : [],
    },
  };
}

export default async function AlbumDetailPage({ params }: AlbumDetailPageProps) {
  const { slug } = await params;
  const album = await getAlbumBySlug(slug);

  if (!album || album.status !== 'PUBLISHED') {
    notFound();
  }

  const photos = await getMediaByAlbum(album.id, true);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      <PublicHeader activeRoute="/galeri" />

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#AF191A]">Beranda</Link>
          <span>/</span>
          <Link href="/galeri" className="hover:text-[#AF191A]">Galeri</Link>
          <span>/</span>
          <Link href="/galeri/foto" className="hover:text-[#AF191A]">Album Foto</Link>
          <span>/</span>
          <span className="text-[#191919] font-medium line-clamp-1 max-w-xs sm:max-w-md">
            {album.title}
          </span>
        </nav>

        {/* Album Header Bar */}
        <div className="p-6 sm:p-8 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 text-[11px] font-mono font-bold uppercase rounded-md bg-[#AF191A] text-white">
                ALBUM FOTO
              </span>
              <span className="px-2.5 py-1 text-[11px] font-mono font-bold rounded-md bg-white border border-neutral-200 text-neutral-700">
                📷 {photos.length} Foto
              </span>
            </div>

            {/* Share Buttons */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-400">Bagikan:</span>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`${album.title} - https://rahmatichwanbahtiar.id/galeri/foto/${album.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-md bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 font-semibold transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(album.title)}&url=${encodeURIComponent(`https://rahmatichwanbahtiar.id/galeri/foto/${album.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-md bg-neutral-900 text-white hover:bg-neutral-800 font-semibold transition-colors"
              >
                X (Twitter)
              </a>
            </div>
          </div>

          <div className="space-y-2 max-w-3xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#191919] tracking-tight leading-tight">
              {album.title}
            </h1>
            {album.description && (
              <p className="text-sm text-neutral-600 leading-relaxed font-normal pt-1">
                {album.description}
              </p>
            )}
          </div>
        </div>

        {/* Photo Gallery Grid with Interactive Lightbox */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
              Koleksi Dokumentasi ({photos.length} Gambar)
            </span>
            <span className="text-xs text-neutral-400">
              Klik foto untuk memperbesar
            </span>
          </div>

          <LightboxViewer photos={photos} albumTitle={album.title} />
        </section>

        {/* Bottom Back Button */}
        <div className="pt-8 border-t border-neutral-200 flex justify-between items-center">
          <Link
            href="/galeri/foto"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#AF191A] hover:underline"
          >
            &larr; Kembali ke Semua Album Foto
          </Link>
          <Link
            href="/galeri"
            className="text-xs text-neutral-500 hover:text-neutral-800"
          >
            Beranda Galeri &rarr;
          </Link>
        </div>
      </main>

      <footer className="py-12 px-6 bg-neutral-50 border-t border-neutral-200 text-xs text-neutral-600 text-center mt-12">
        <div className="max-w-6xl mx-auto space-y-2">
          <p className="font-bold text-[#191919] text-sm">Rahmat Ichwan Bahtiar</p>
          <p className="text-[#AF191A] font-medium">Platform Resmi Informasi &amp; Akuntabilitas Publik</p>
          <p className="text-[11px] text-neutral-400 pt-4">
            &copy; {new Date().getFullYear()} Rahmat Ichwan Bahtiar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
