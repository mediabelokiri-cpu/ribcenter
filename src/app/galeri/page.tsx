/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { getPublishedAlbums, getPublishedVideos, getMediaItems } from '@/services/media';
import { VideoPlayerModal } from './video-player-modal';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Galeri & Dokumentasi Publik | Rahmat Ichwan Bahtiar',
  description:
    'Pusat arsip dokumentasi visual kegiatan, liputan lapangan, album rekam jejak, dan video resmi Rahmat Ichwan Bahtiar.',
};

export default async function GaleriPage() {
  const [albums, videos, allMedia] = await Promise.all([
    getPublishedAlbums(8),
    getPublishedVideos(6),
    getMediaItems({ limit: 1000 }),
  ]);

  // Media count lookup per album
  const mediaCounts: Record<string, number> = {};
  allMedia.forEach((m) => {
    if (m.album_id) {
      mediaCounts[m.album_id] = (mediaCounts[m.album_id] || 0) + 1;
    }
  });

  const featuredAlbums = albums.filter((a) => a.featured);
  const displayFeatured = featuredAlbums.length > 0 ? featuredAlbums[0] : albums[0];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      {/* Public Header */}
      <PublicHeader activeRoute="/galeri" />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-12">
        {/* Page Header */}
        <div className="space-y-2 border-b border-neutral-200 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#AF191A]">
            <span>Arsip Dokumentasi Visual</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[#191919]">
            Galeri Foto &amp; Video Kegiatan
          </h1>
          <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
            Kumpulan dokumentasi otentik kegiatan pengabdian publik, kunjungan kerja, dialog konstituen, dan liputan lapangan Rahmat Ichwan Bahtiar.
          </p>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-2 pt-4">
            <Link
              href="/galeri"
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-[#191919] text-white shadow-xs"
            >
              Semua Galeri
            </Link>
            <Link
              href="/galeri/foto"
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
            >
              Album Foto ({albums.length})
            </Link>
            <Link
              href="/galeri/video"
              className="px-4 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 transition-colors"
            >
              Video Dokumentasi ({videos.length})
            </Link>
          </div>
        </div>

        {/* 1. SOROTAN UTAMA (FEATURED ALBUM SHOWCASE) */}
        {displayFeatured && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
                ★ Sorotan Dokumentasi Utama
              </span>
            </div>

            <Link
              href={`/galeri/foto/${displayFeatured.slug}`}
              className="group relative block rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-lg transition-all aspect-21/9 min-h-[300px] sm:min-h-[380px]"
            >
              {displayFeatured.cover_image_url ? (
                <img
                  src={displayFeatured.cover_image_url}
                  alt={displayFeatured.title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 bg-neutral-900" />
              )}
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

              {/* Text Container */}
              <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 space-y-2 text-white">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#AF191A] text-white uppercase tracking-wider">
                    ALBUM UNGGULAN
                  </span>
                  <span className="text-xs font-mono text-[#FFCC00]">
                    📷 {mediaCounts[displayFeatured.id] || 0} Foto Dokumentasi
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-[#FFCC00] transition-colors leading-tight drop-shadow-sm">
                  {displayFeatured.title}
                </h2>
                {displayFeatured.description && (
                  <p className="text-xs sm:text-sm text-neutral-200 line-clamp-2 max-w-2xl leading-relaxed">
                    {displayFeatured.description}
                  </p>
                )}
                <div className="pt-2">
                  <span className="inline-flex items-center text-xs font-semibold text-[#FFCC00] group-hover:underline">
                    Buka Album Lengkap &rarr;
                  </span>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* 2. ALBUM FOTO TERKINI */}
        <section className="space-y-6">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
                Koleksi Visual
              </span>
              <h2 className="text-xl font-bold text-[#191919]">Album Foto Kegiatan</h2>
            </div>
            <Link
              href="/galeri/foto"
              className="text-xs font-semibold text-[#AF191A] hover:underline"
            >
              Lihat Semua Album ({albums.length}) &rarr;
            </Link>
          </div>

          {albums.length === 0 ? (
            <p className="text-xs text-neutral-400 italic py-6">Belum ada album foto yang dipublikasikan.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {albums.map((album) => {
                const count = mediaCounts[album.id] || 0;
                return (
                  <Link
                    key={album.id}
                    href={`/galeri/foto/${album.slug}`}
                    className="group bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:border-[#AF191A] hover:shadow-md transition-all flex flex-col"
                  >
                    {/* Cover Thumbnail */}
                    <div className="aspect-4/3 bg-neutral-100 overflow-hidden relative">
                      {album.cover_image_url ? (
                        <img
                          src={album.cover_image_url}
                          alt={album.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl text-neutral-400">
                          📷
                        </div>
                      )}
                      <span className="absolute bottom-2 right-2 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/75 text-white">
                        {count} Foto
                      </span>
                    </div>

                    {/* Content Info */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <h3 className="text-sm font-bold text-[#191919] line-clamp-2 group-hover:text-[#AF191A] transition-colors leading-snug">
                          {album.title}
                        </h3>
                        {album.description && (
                          <p className="text-xs text-neutral-500 line-clamp-2 mt-1 leading-relaxed">
                            {album.description}
                          </p>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-[#AF191A] pt-2 border-t border-neutral-100">
                        Buka Album &rarr;
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* 3. DOKUMENTASI VIDEO LAPANGAN */}
        <section className="space-y-6 pt-6 border-t border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
                Dokumentasi Bergerak
              </span>
              <h2 className="text-xl font-bold text-[#191919]">Video Liputan Lapangan</h2>
            </div>
            <Link
              href="/galeri/video"
              className="text-xs font-semibold text-[#AF191A] hover:underline"
            >
              Lihat Semua Video ({videos.length}) &rarr;
            </Link>
          </div>

          <VideoPlayerModal videos={videos} />
        </section>
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
