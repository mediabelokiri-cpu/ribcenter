'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import type { ActivityCategory } from '@/types/database';

interface RekamKerjaFilterProps {
  categories: ActivityCategory[];
  regencies: string[];
  years: number[];
  currentType?: string;
  currentCategory?: string;
  currentRegency?: string;
  currentYear?: string;
}

export function RekamKerjaFilter({
  categories,
  regencies,
  years,
  currentType = '',
  currentCategory = '',
  currentRegency = '',
  currentYear = '',
}: RekamKerjaFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val) {
      params.set(key, val);
    } else {
      params.delete(key);
    }
    router.push(`/rekam-kerja?${params.toString()}`);
  };

  const handleReset = () => {
    router.push('/rekam-kerja');
  };

  const hasActiveFilter = !!(currentType || currentCategory || currentRegency || currentYear);

  const typeTabs = [
    { label: 'Semua Tipe', value: '' },
    { label: 'Rekam Kerja', value: 'REKAM_KERJA' },
    { label: 'Program', value: 'PROGRAM' },
    { label: 'Kegiatan', value: 'KEGIATAN' },
    { label: 'Reses', value: 'RESES' },
  ];

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
      {/* Type Pill Tabs */}
      <div className="flex flex-wrap gap-2 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        {typeTabs.map((tab) => {
          const isActive = currentType === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => updateParam('type', tab.value)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl transition-colors ${
                isActive
                  ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-sm'
                  : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Select Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Category Select */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
            Kategori
          </label>
          <select
            value={currentCategory}
            onChange={(e) => updateParam('category', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Regency Select */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
            Wilayah / Kabupaten
          </label>
          <select
            value={currentRegency}
            onChange={(e) => updateParam('regency', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="">Semua Wilayah</option>
            {regencies.map((reg) => (
              <option key={reg} value={reg}>
                {reg}
              </option>
            ))}
          </select>
        </div>

        {/* Year Select */}
        <div>
          <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
            Periode / Tahun
          </label>
          <select
            value={currentYear}
            onChange={(e) => updateParam('year', e.target.value)}
            className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
          >
            <option value="">Semua Periode</option>
            {years.map((yr) => (
              <option key={yr} value={yr.toString()}>
                Tahun {yr}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Reset Filter Button */}
      {hasActiveFilter && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline font-semibold"
          >
            Bersihkan Semua Filter
          </button>
        </div>
      )}
    </div>
  );
}
