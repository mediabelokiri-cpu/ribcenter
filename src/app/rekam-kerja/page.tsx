import { Suspense } from 'react';
import Link from 'next/link';
import type { ActivityType } from '@/types/database';
import {
  getPublishedActivities,
  getActivityCategories,
  getDistinctRegencies,
  getDistinctYears,
} from '@/services/activities';
import { getProfile } from '@/services/profile';
import { RekamKerjaFilter } from './rekam-kerja-filter';

export const dynamic = 'force-dynamic';

interface RekamKerjaPageProps {
  searchParams: Promise<{
    type?: string;
    category?: string;
    regency?: string;
    year?: string;
  }>;
}

export default async function RekamKerjaPage({ searchParams }: RekamKerjaPageProps) {
  const params = await searchParams;
  const currentType = params.type as ActivityType | undefined;
  const currentCategory = params.category;
  const currentRegency = params.regency;
  const currentYear = params.year ? parseInt(params.year, 10) : undefined;

  const [profile, categories, regencies, years, activities] = await Promise.all([
    getProfile(),
    getActivityCategories({ activeOnly: true }),
    getDistinctRegencies(),
    getDistinctYears(),
    getPublishedActivities({
      type: currentType,
      categorySlug: currentCategory,
      regency: currentRegency,
      year: isNaN(currentYear as number) ? undefined : currentYear,
    }),
  ]);

  const getTypeBadge = (type: ActivityType) => {
    switch (type) {
      case 'REKAM_KERJA':
        return 'bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20';
      case 'PROGRAM':
        return 'bg-[#191919]/10 text-[#191919] dark:bg-white/10 dark:text-white border border-[#191919]/20';
      case 'KEGIATAN':
        return 'bg-[#FFCC00]/20 text-[#191919] dark:text-[#FFCC00] border border-[#FFCC00]/40';
      case 'RESES':
        return 'bg-purple-50 text-purple-900 dark:bg-purple-950 dark:text-purple-300 border border-purple-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#191919] text-[#191919] dark:text-white">
      {/* Public Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#191919]/95 backdrop-blur border-b border-neutral-200 dark:border-[#2A2A2A]">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-base tracking-tight text-[#191919] dark:text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#AF191A]"></span>
            {profile?.display_name || 'Rahmat Ichwan Bahtiar'}
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-neutral-600 hover:text-[#AF191A] dark:text-neutral-400 dark:hover:text-[#FFCC00] transition-colors">
              Beranda
            </Link>
            <Link href="/tentang" className="text-neutral-600 hover:text-[#AF191A] dark:text-neutral-400 dark:hover:text-[#FFCC00] transition-colors">
              Tentang
            </Link>
            <Link href="/rekam-kerja" className="text-[#AF191A] dark:text-[#FFCC00] font-bold">
              Rekam Kerja
            </Link>
            <Link href="/kabar" className="text-neutral-600 hover:text-[#AF191A] dark:text-neutral-400 dark:hover:text-[#FFCC00] transition-colors">
              Kabar
            </Link>
            <Link href="/galeri" className="text-neutral-600 hover:text-[#AF191A] dark:text-neutral-400 dark:hover:text-[#FFCC00] transition-colors">
              Galeri
            </Link>
            <Link href="/aspirasi" className="text-neutral-600 hover:text-[#AF191A] dark:text-neutral-400 dark:hover:text-[#FFCC00] transition-colors">
              Aspirasi
            </Link>
            <Link href="/kontak" className="text-neutral-600 hover:text-[#AF191A] dark:text-neutral-400 dark:hover:text-[#FFCC00] transition-colors">
              Kontak
            </Link>
            <Link
              href="/admin"
              className="ml-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#191919] text-white hover:bg-[#AF191A] dark:bg-white dark:text-[#191919] dark:hover:bg-[#FFCC00] transition-colors shadow-sm"
            >
              CMS Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 space-y-10">
        {/* Heading & Introduction */}
        <div className="max-w-3xl space-y-3">
          <span className="inline-block px-3.5 py-1 text-xs font-bold tracking-wide uppercase rounded-full bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20">
            Akuntabilitas Publik
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#191919] dark:text-white">
            Rekam Kerja &amp; Program
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Transparansi dan dokumentasi pertanggungjawaban kegiatan pengabdian, program advokasi
            kemasyarakatan, catatan reses, dan kerja nyata Rahmat Ichwan Bahtiar.
          </p>
        </div>

        {/* Filter Bar with Suspense */}
        <Suspense fallback={<div className="p-6 bg-white dark:bg-[#1C1C1C] rounded-xl border border-neutral-200 dark:border-[#2A2A2A] text-xs text-neutral-400">Memuat filter...</div>}>
          <RekamKerjaFilter
            categories={categories}
            regencies={regencies}
            years={years}
            currentType={params.type}
            currentCategory={params.category}
            currentRegency={params.regency}
            currentYear={params.year}
          />
        </Suspense>

        {/* Results Counter */}
        <div className="flex justify-between items-center text-xs text-neutral-500 border-b border-neutral-200 dark:border-[#2A2A2A] pb-3">
          <span>
            Menemukan <strong>{activities.length}</strong> catatan rekam kerja publik
          </span>
        </div>

        {/* Activities Grid */}
        {activities.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-neutral-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1C1C1C] space-y-4">
            <h3 className="text-base font-bold text-[#191919] dark:text-white">
              Tidak Ada Rekam Kerja yang Ditemukan
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Tidak ada catatan kegiatan atau program yang sesuai dengan kombinasi filter yang dipilih. Silakan atur ulang kriteria pencarian.
            </p>
            <Link
              href="/rekam-kerja"
              className="inline-block px-4 py-2 text-xs font-semibold rounded-lg bg-[#AF191A] text-white hover:bg-[#921415] transition-colors"
            >
              Reset Semua Filter
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act) => (
              <Link
                key={act.id}
                href={`/rekam-kerja/${act.slug}`}
                className="group flex flex-col justify-between p-6 rounded-2xl border border-neutral-200 dark:border-[#2A2A2A] bg-white dark:bg-[#1C1C1C] hover:border-[#AF191A] dark:hover:border-[#FFCC00] transition-all shadow-sm hover:shadow"
              >
                <div className="space-y-3">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-semibold border rounded-md ${getTypeBadge(
                        act.type
                      )}`}
                    >
                      {act.type}
                    </span>
                    {act.category && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-md bg-neutral-100 dark:bg-[#252525] text-neutral-700 dark:text-neutral-300">
                        {act.category.name}
                      </span>
                    )}
                    {act.featured && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded-md bg-[#FFCC00] text-[#191919]">
                        ★ Unggulan
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-base font-bold text-[#191919] dark:text-white group-hover:text-[#AF191A] dark:group-hover:text-[#FFCC00] transition-colors leading-snug">
                    {act.title}
                  </h2>

                  {/* Summary */}
                  {act.summary && (
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                      {act.summary}
                    </p>
                  )}
                </div>

                {/* Metadata Footer */}
                <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-[#2A2A2A] text-[11px] text-neutral-500 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono">{act.date}</span>
                    <span>{act.regency || act.location || 'Wilayah Umum'}</span>
                  </div>
                  {act.beneficiaries > 0 && (
                    <div className="text-[10px] text-[#AF191A] dark:text-[#FFCC00] font-semibold">
                      Penerima Manfaat: {act.beneficiaries.toLocaleString('id-ID')} orang/kelompok
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Public Footer */}
      <footer className="py-12 px-6 bg-[#191919] border-t border-[#2A2A2A] text-xs text-neutral-400 text-center mt-20">
        <div className="max-w-6xl mx-auto space-y-2">
          <p className="font-bold text-white text-sm">
            {profile?.display_name || 'Rahmat Ichwan Bahtiar'}
          </p>
          <p className="text-[#FFCC00] font-medium">Platform Resmi Informasi &amp; Akuntabilitas Publik</p>
          <p className="text-[11px] text-neutral-500 pt-4">
            &copy; {new Date().getFullYear()} Rahmat Ichwan Bahtiar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
