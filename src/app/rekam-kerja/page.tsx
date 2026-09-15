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
        return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'PROGRAM':
        return 'bg-blue-50 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'KEGIATAN':
        return 'bg-amber-50 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800';
      case 'RESES':
        return 'bg-purple-50 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Public Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100">
            {profile?.display_name || 'Rahmat Ichwan Bahtiar'}
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Beranda
            </Link>
            <Link href="/tentang" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Tentang
            </Link>
            <Link href="/rekam-kerja" className="text-neutral-900 dark:text-white font-semibold">
              Rekam Kerja
            </Link>
            <Link href="/kabar" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Kabar
            </Link>
            <Link href="/galeri" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Galeri
            </Link>
            <Link href="/aspirasi" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Aspirasi
            </Link>
            <Link href="/kontak" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Kontak
            </Link>
            <Link
              href="/admin"
              className="ml-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity"
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
          <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
            Akuntabilitas Publik
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
            Rekam Kerja &amp; Program
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Transparansi dan dokumentasi pertanggungjawaban kegiatan pengabdian, program advokasi
            kemasyarakatan, catatan reses, dan kerja nyata Rahmat Ichwan Bahtiar.
          </p>
        </div>

        {/* Filter Bar with Suspense */}
        <Suspense fallback={<div className="p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-400">Memuat filter...</div>}>
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
        <div className="flex justify-between items-center text-xs text-neutral-500 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <span>
            Menemukan <strong>{activities.length}</strong> catatan rekam kerja publik
          </span>
        </div>

        {/* Activities Grid */}
        {activities.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 space-y-4">
            <h3 className="text-base font-bold text-neutral-800 dark:text-neutral-200">
              Tidak Ada Rekam Kerja yang Ditemukan
            </h3>
            <p className="text-xs text-neutral-500 max-w-md mx-auto">
              Tidak ada catatan kegiatan atau program yang sesuai dengan kombinasi filter yang dipilih. Silakan atur ulang kriteria pencarian.
            </p>
            <Link
              href="/rekam-kerja"
              className="inline-block px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
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
                className="group flex flex-col justify-between p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all shadow-sm hover:shadow"
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
                      <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                        {act.category.name}
                      </span>
                    )}
                    {act.featured && (
                      <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded-md bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                        Unggulan
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
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
                <div className="pt-4 mt-4 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-500 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono">{act.date}</span>
                    <span>{act.regency || act.location || 'Wilayah Umum'}</span>
                  </div>
                  {act.beneficiaries > 0 && (
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">
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
      <footer className="border-t border-neutral-200 dark:border-neutral-800 py-8 px-6 bg-white dark:bg-neutral-900 mt-20">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-neutral-500">
          <div>&copy; {new Date().getFullYear()} Rahmat Ichwan Bahtiar. Platform Informasi &amp; Akuntabilitas Publik.</div>
          <div className="flex gap-4">
            <Link href="/" className="hover:underline">Beranda</Link>
            <Link href="/tentang" className="hover:underline">Tentang</Link>
            <Link href="/rekam-kerja" className="hover:underline">Rekam Kerja</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
