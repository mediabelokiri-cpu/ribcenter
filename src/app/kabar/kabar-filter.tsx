'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';

interface KabarFilterProps {
  activeType: 'ALL' | 'BERITA' | 'GAGASAN';
  currentSearch?: string;
  totalCount: number;
  beritaCount: number;
  gagasanCount: number;
}

export function KabarFilter({
  activeType,
  currentSearch = '',
  totalCount,
  beritaCount,
  gagasanCount,
}: KabarFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(currentSearch);
  const [isPending, startTransition] = useTransition();

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search.trim()) {
      params.set('q', search.trim());
    } else {
      params.delete('q');
    }

    const basePath =
      activeType === 'BERITA'
        ? '/kabar/berita'
        : activeType === 'GAGASAN'
        ? '/kabar/gagasan'
        : '/kabar';

    const queryString = params.toString();
    startTransition(() => {
      router.push(queryString ? `${basePath}?${queryString}` : basePath);
    });
  };

  const handleClearSearch = () => {
    setSearch('');
    const basePath =
      activeType === 'BERITA'
        ? '/kabar/berita'
        : activeType === 'GAGASAN'
        ? '/kabar/gagasan'
        : '/kabar';

    startTransition(() => {
      router.push(basePath);
    });
  };

  return (
    <div className="p-4 bg-white border border-neutral-200 rounded-2xl shadow-xs space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Type Pill Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <Link
            href="/kabar"
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeType === 'ALL'
                ? 'bg-[#AF191A] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Semua Kabar ({totalCount})
          </Link>
          <Link
            href="/kabar/berita"
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeType === 'BERITA'
                ? 'bg-[#AF191A] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Berita &amp; Liputan ({beritaCount})
          </Link>
          <Link
            href="/kabar/gagasan"
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeType === 'GAGASAN'
                ? 'bg-[#AF191A] text-white shadow-xs'
                : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
            }`}
          >
            Gagasan &amp; Opini ({gagasanCount})
          </Link>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Cari artikel, topik..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-3.5 pr-8 py-2 text-xs border border-neutral-300 rounded-xl bg-white text-[#191919] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
          />
          {search ? (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
            >
              &times;
            </button>
          ) : (
            <button
              type="submit"
              disabled={isPending}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-[#AF191A]"
            >
              🔍
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
