import { Suspense } from 'react';
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import type { ActivityType } from '@/types/database';
import {
  getPublishedActivities,
  getActivityCategories,
  getDistinctRegencies,
  getDistinctYears,
} from '@/services/activities';
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

  const [categories, regencies, years, activities] = await Promise.all([
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
        return 'bg-neutral-100 text-[#191919] border border-neutral-300';
      case 'KEGIATAN':
        return 'bg-[#FFCC00]/20 text-[#191919] border border-[#FFCC00]/50';
      case 'RESES':
        return 'bg-purple-50 text-purple-900 border border-purple-200';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      {/* Public Header */}
      <PublicHeader activeRoute="/rekam-kerja" />

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 space-y-10">
        {/* Heading & Introduction */}
        <div className="max-w-3xl space-y-3">
          <span className="inline-block px-3.5 py-1 text-xs font-bold tracking-wide uppercase rounded-full bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20">
            Akuntabilitas Publik
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#191919]">
            Rekam Kerja &amp; Program
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
            Transparansi dan dokumentasi pertanggungjawaban kegiatan pengabdian, program advokasi
            kemasyarakatan, catatan reses, dan kerja nyata Rahmat Ichwan Bahtiar.
          </p>
        </div>

        {/* Filter Bar with Suspense */}
        <Suspense fallback={<div className="p-6 bg-white rounded-xl border border-neutral-200 text-xs text-neutral-400">Memuat filter...</div>}>
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
        <div className="flex justify-between items-center text-xs text-neutral-500 border-b border-neutral-200 pb-3">
          <span>
            Menemukan <strong>{activities.length}</strong> catatan rekam kerja publik
          </span>
        </div>

        {/* Activities Grid */}
        {activities.length === 0 ? (
          <div className="p-12 text-center rounded-2xl border border-neutral-200 bg-white space-y-4">
            <h3 className="text-base font-bold text-[#191919]">
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
                className="group flex flex-col justify-between p-6 rounded-2xl border border-neutral-200 bg-white hover:border-[#AF191A] transition-all shadow-xs hover:shadow-sm"
              >
                <div className="space-y-3">
                  {act.cover_image_url ? (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-neutral-100">
                      <img
                        src={act.cover_image_url}
                        alt={act.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video w-full rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 font-mono text-xs">
                      🏛️ Rekam Kerja
                    </div>
                  )}

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
                      <span className="inline-block px-2 py-0.5 text-[10px] font-medium rounded-md bg-neutral-100 text-neutral-700">
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
                  <h2 className="text-base font-bold text-[#191919] group-hover:text-[#AF191A] transition-colors leading-snug">
                    {act.title}
                  </h2>

                  {/* Summary */}
                  {act.summary && (
                    <p className="text-xs text-neutral-600 line-clamp-3 leading-relaxed">
                      {act.summary}
                    </p>
                  )}
                </div>

                {/* Metadata Footer */}
                <div className="pt-4 mt-4 border-t border-neutral-100 text-[11px] text-neutral-500 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-mono">{act.date}</span>
                    <span>{act.regency || act.location || 'Wilayah Umum'}</span>
                  </div>
                  {act.beneficiaries > 0 && (
                    <div className="text-[10px] text-[#AF191A] font-semibold">
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
      <PublicFooter />
    </div>
  );
}
