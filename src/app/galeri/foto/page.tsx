/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { getPublishedAlbums, getMediaItems } from '@/services/media';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Album Foto Kegiatan & Liputan | Rahmat Ichwan Bahtiar',
  description:
    'Arsip lengkap dokumentasi visual dan album foto kegiatan pengabdian publik Rahmat Ichwan Bahtiar.',
};

export default async function GaleriFotoPage() {
  const [albums, allMedia] = await Promise.all([
    getPublishedAlbums(),
    getMediaItems({ limit: 1000 }),
  ]);

  const mediaCounts: Record<string, number> = {};
  allMedia.forEach((m) => {
    if (m.album_id) {
      mediaCounts[m.album_id] = (mediaCounts[m.album_id] || 0) + 1;
    }
  });

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
          <span className="text-[#191919] font-medium">Album Foto</span>
        </nav>

        {/* Page Header */}
        <div className="space-y-2 border-b border-neutral-200 pb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
            Arsip Visual
          </span>
          <h1 className="text-3xl font-black tracking-tight text-[#191919]">
            Koleksi Album Foto Kegiatan
          </h1>
          <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
            Dokumentasi lengkap foto-foto kegiatan lapangan, musyawarah konstituen, dan peresmian program secara kronologis.
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
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#191919] text-white shadow-xs"
            >
              Semua Album ({albums.length})
            </Link>
            <Link
              href="/galeri/video"
              className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            >
              Video Dokumentasi
            </Link>
          </div>
        </div>

        {/* Albums Grid */}
        {albums.length === 0 ? (
          <div className="p-16 text-center bg-neutral-50 rounded-2xl border border-neutral-200 space-y-2">
            <span className="text-4xl block">📷</span>
            <p className="text-sm font-semibold text-neutral-700">Belum ada album foto</p>
            <p className="text-xs text-neutral-400">
              Album foto dokumentasi akan tampil di sini begitu dipublikasikan.
            </p>
          </div>
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

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <h2 className="text-sm font-bold text-[#191919] line-clamp-2 group-hover:text-[#AF191A] transition-colors leading-snug">
                        {album.title}
                      </h2>
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
      </main>

      <PublicFooter />
    </div>
  );
}
