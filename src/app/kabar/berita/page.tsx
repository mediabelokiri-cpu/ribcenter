/* eslint-disable @next/next/no-img-element */
import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { getPublishedArticles } from '@/services/articles';
import { KabarFilter } from '../kabar-filter';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Berita & Liputan - Rahmat Ichwan Bahtiar',
  description:
    'Rilis berita resmi kegiatan advokasi, peninjauan lapangan, dan laporan program kerja kemasyarakatan Rahmat Ichwan Bahtiar.',
};

interface BeritaPageProps {
  searchParams: Promise<{ q?: string }>;
}

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(iso: string | null): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default async function BeritaPage({ searchParams }: BeritaPageProps) {
  const params = await searchParams;
  const searchQuery = params.q?.trim() || '';

  const [beritaList, allBerita, allGagasan] = await Promise.all([
    getPublishedArticles({ type: 'BERITA', search: searchQuery }),
    getPublishedArticles({ type: 'BERITA' }),
    getPublishedArticles({ type: 'GAGASAN' }),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      {/* Public Header */}
      <PublicHeader activeRoute="/kabar" />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-8">
        {/* Title Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Link href="/kabar" className="text-xs text-neutral-500 hover:text-[#AF191A]">
              &larr; Indeks Kabar
            </Link>
            <span className="text-neutral-300">/</span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
              Berita &amp; Liputan
            </span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-[#191919]">
            Berita Kegiatan &amp; Program
          </h1>
          <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
            Dokumentasi dan laporan resmi pelaksanaan kegiatan lapangan, program advokasi konstituen, serta warta akuntabilitas kerja.
          </p>
        </div>

        {/* Filter Bar */}
        <Suspense fallback={<div className="h-16 bg-neutral-100 rounded-2xl animate-pulse" />}>
          <KabarFilter
            activeType="BERITA"
            currentSearch={searchQuery}
            totalCount={allBerita.length + allGagasan.length}
            beritaCount={allBerita.length}
            gagasanCount={allGagasan.length}
          />
        </Suspense>

        {/* Articles Grid */}
        {beritaList.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 space-y-2">
            <span className="text-2xl">📰</span>
            <p className="text-sm font-semibold text-neutral-700">
              Belum ada berita yang sesuai.
            </p>
            <p className="text-xs text-neutral-500">
              Silakan kembali atau periksa kata kunci pencarian Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-500 font-medium pb-2 border-b border-neutral-100">
              <span>Menampilkan {beritaList.length} berita kegiatan</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {beritaList.map((art) => (
                <Link
                  key={art.id}
                  href={`/kabar/${art.slug}`}
                  className="group flex flex-col justify-between p-5 rounded-2xl border border-neutral-200 bg-white hover:border-[#AF191A] hover:shadow-sm transition-all"
                >
                  <div className="space-y-3">
                    {art.cover_image_url ? (
                      <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-100">
                        <img
                          src={art.cover_image_url}
                          alt={art.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video w-full rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 font-mono text-xs">
                        📰 Warta Liputan
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20">
                        BERITA
                      </span>
                      {art.featured && (
                        <span className="text-[10px] font-bold text-[#FFCC00]">
                          ★ Unggulan
                        </span>
                      )}
                      {art.category && (
                        <span className="text-[10px] text-neutral-500">
                          • {art.category}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-[#191919] group-hover:text-[#AF191A] transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                      {art.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>{formatDate(art.published_at || art.created_at)}</span>
                    <span>{calculateReadingTime(art.content)} mnt baca</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
