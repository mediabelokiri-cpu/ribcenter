/* eslint-disable @next/next/no-img-element */
import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/public-header';
import { getPublishedArticles } from '@/services/articles';
import { getProfile } from '@/services/profile';
import { KabarFilter } from './kabar-filter';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Kabar & Gagasan - Rahmat Ichwan Bahtiar',
  description:
    'Rilis berita kegiatan resmi, laporan kerja lapangan, serta catatan pemikiran dan opini kebijakan pembangunan daerah oleh Rahmat Ichwan Bahtiar.',
};

interface KabarPageProps {
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

export default async function KabarPage({ searchParams }: KabarPageProps) {
  const params = await searchParams;
  const searchQuery = params.q?.trim() || '';

  const [profile, allArticles, beritaList, gagasanList] = await Promise.all([
    getProfile(),
    getPublishedArticles({ search: searchQuery }),
    getPublishedArticles({ type: 'BERITA' }),
    getPublishedArticles({ type: 'GAGASAN' }),
  ]);

  // Featured article (first featured if exists, or null)
  const featuredArticle = !searchQuery ? allArticles.find((a) => a.featured) : null;
  const regularArticles = featuredArticle
    ? allArticles.filter((a) => a.id !== featuredArticle.id)
    : allArticles;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      {/* Public Header */}
      <PublicHeader activeRoute="/kabar" />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-10 space-y-8">
        {/* Title Header */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
            Publikasi &amp; Catatan Pemikiran
          </span>
          <h1 className="text-3xl font-black tracking-tight text-[#191919]">
            Kabar &amp; Gagasan
          </h1>
          <p className="text-sm text-neutral-600 max-w-2xl leading-relaxed">
            Arsip berita resmi kegiatan lapangan, liputan program advokasi, serta catatan pemikiran kebijakan publik dan refleksi pembangunan daerah.
          </p>
        </div>

        {/* Filter Bar */}
        <Suspense fallback={<div className="h-16 bg-neutral-100 rounded-2xl animate-pulse" />}>
          <KabarFilter
            activeType="ALL"
            currentSearch={searchQuery}
            totalCount={beritaList.length + gagasanList.length}
            beritaCount={beritaList.length}
            gagasanCount={gagasanList.length}
          />
        </Suspense>

        {/* Featured Hero Card (if available and not searching) */}
        {featuredArticle && (
          <div className="p-6 md:p-8 bg-neutral-50 border border-neutral-200 rounded-2xl hover:border-[#AF191A] transition-all group">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {featuredArticle.cover_image_url && (
                <div className="md:col-span-5 overflow-hidden rounded-xl bg-neutral-200 aspect-video md:aspect-[4/3]">
                  <img
                    src={featuredArticle.cover_image_url}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className={`${featuredArticle.cover_image_url ? 'md:col-span-7' : 'md:col-span-12'} space-y-3`}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded bg-[#FFCC00]/25 text-[#191919] border border-[#FFCC00]/50">
                    ★ Sorotan Utama
                  </span>
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                      featuredArticle.type === 'BERITA'
                        ? 'bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20'
                        : 'bg-neutral-100 text-[#191919] border border-neutral-300'
                    }`}
                  >
                    {featuredArticle.type}
                  </span>
                  {featuredArticle.category && (
                    <span className="text-[11px] text-neutral-500 font-medium">
                      • {featuredArticle.category}
                    </span>
                  )}
                </div>

                <Link href={`/kabar/${featuredArticle.slug}`}>
                  <h2 className="text-xl md:text-2xl font-bold text-[#191919] group-hover:text-[#AF191A] transition-colors leading-snug">
                    {featuredArticle.title}
                  </h2>
                </Link>

                <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>

                <div className="flex items-center gap-3 pt-2 text-[11px] text-neutral-500">
                  <span>{formatDate(featuredArticle.published_at)}</span>
                  <span>•</span>
                  <span>{calculateReadingTime(featuredArticle.content)} mnt baca</span>
                  <span>•</span>
                  <span>Oleh: {featuredArticle.author}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Articles Grid */}
        {regularArticles.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50 space-y-2">
            <span className="text-2xl">📰</span>
            <p className="text-sm font-semibold text-neutral-700">
              Tidak ada artikel yang ditemukan.
            </p>
            <p className="text-xs text-neutral-500">
              Coba gunakan kata kunci pencarian yang lain atau kembali ke seluruh artikel.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-neutral-500 font-medium pb-2 border-b border-neutral-100">
              <span>Menampilkan {regularArticles.length} artikel</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {regularArticles.map((art) => (
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
                        {art.type === 'BERITA' ? '📰 Warta Liputan' : '💡 Catatan Gagasan'}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                          art.type === 'BERITA'
                            ? 'bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20'
                            : 'bg-neutral-100 text-[#191919] border border-neutral-300'
                        }`}
                      >
                        {art.type}
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
      <footer className="py-8 border-t border-neutral-200 bg-neutral-50 text-neutral-600 text-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div>
            <p className="font-semibold text-[#191919]">
              {profile?.display_name || 'Rahmat Ichwan Bahtiar'}
            </p>
            <p className="text-neutral-500 text-[11px] mt-0.5">
              Platform Informasi Publik &amp; Akuntabilitas Kerja
            </p>
          </div>
          <p className="text-neutral-500">
            &copy; {new Date().getFullYear()} Rahmat Ichwan Bahtiar. Seluruh hak cipta dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
