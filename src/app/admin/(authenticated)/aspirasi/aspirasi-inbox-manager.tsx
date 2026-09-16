'use client';

import { useState, useMemo } from 'react';
import type { Aspiration, AspirationStatus } from '@/types/database';
import { AspirationDetailModal } from './aspiration-detail-modal';
import { useRouter } from 'next/navigation';

interface AspirasiInboxManagerProps {
  initialAspirations: Aspiration[];
}

const STATUS_FILTERS: { key: AspirationStatus | 'ALL'; label: string }[] = [
  { key: 'ALL', label: 'Semua' },
  { key: 'BARU', label: 'Baru' },
  { key: 'DITINJAU', label: 'Ditinjau' },
  { key: 'DALAM_TINDAK_LANJUT', label: 'Dalam Tindak Lanjut' },
  { key: 'SELESAI', label: 'Selesai' },
  { key: 'INFORMASI_DIBERIKAN', label: 'Info Diberikan' },
];

export function AspirasiInboxManager({ initialAspirations }: AspirasiInboxManagerProps) {
  const router = useRouter();
  const [selectedStatus, setSelectedStatus] = useState<AspirationStatus | 'ALL'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAspiration, setActiveAspiration] = useState<Aspiration | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Compute available categories dynamically
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialAspirations.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return Array.from(set);
  }, [initialAspirations]);

  // Metrics
  const metrics = useMemo(() => {
    const total = initialAspirations.length;
    const baru = initialAspirations.filter((a) => a.status === 'BARU').length;
    const diproses = initialAspirations.filter(
      (a) => a.status === 'DITINJAU' || a.status === 'DALAM_TINDAK_LANJUT'
    ).length;
    const tuntas = initialAspirations.filter(
      (a) => a.status === 'SELESAI' || a.status === 'INFORMASI_DIBERIKAN'
    ).length;
    return { total, baru, diproses, tuntas };
  }, [initialAspirations]);

  // Filtered list
  const filteredList = useMemo(() => {
    return initialAspirations.filter((item) => {
      // Status filter
      if (selectedStatus !== 'ALL' && item.status !== selectedStatus) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesSubject = item.subject.toLowerCase().includes(q);
        const matchesContact = item.contact.toLowerCase().includes(q);
        const matchesRegency = (item.regency || '').toLowerCase().includes(q);
        const matchesDistrict = (item.district || '').toLowerCase().includes(q);
        if (!matchesName && !matchesSubject && !matchesContact && !matchesRegency && !matchesDistrict) {
          return false;
        }
      }
      return true;
    });
  }, [initialAspirations, selectedStatus, selectedCategory, searchQuery]);

  const handleOpenDetail = (aspiration: Aspiration) => {
    setActiveAspiration(aspiration);
    setIsDetailOpen(true);
  };

  const handleUpdated = () => {
    router.refresh();
  };

  const getStatusBadge = (status: AspirationStatus) => {
    switch (status) {
      case 'BARU':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'DITINJAU':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DALAM_TINDAK_LANJUT':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SELESAI':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'INFORMASI_DIBERIKAN':
        return 'bg-neutral-100 text-neutral-700 border-neutral-300';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getStatusDisplayName = (status: AspirationStatus) => {
    switch (status) {
      case 'DALAM_TINDAK_LANJUT':
        return 'DALAM TINDAK LANJUT';
      case 'INFORMASI_DIBERIKAN':
        return 'INFO DIBERIKAN';
      default:
        return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs">
          <span className="text-xs text-neutral-500 font-medium block">Total Aspirasi</span>
          <span className="text-2xl font-black text-[#191919] mt-1 block">{metrics.total}</span>
          <span className="text-[10px] text-neutral-400 mt-0.5 block">Seluruh laporan warga masuk</span>
        </div>
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 shadow-xs">
          <span className="text-xs text-blue-700 font-medium block">Aspirasi Baru</span>
          <span className="text-2xl font-black text-blue-900 mt-1 block">{metrics.baru}</span>
          <span className="text-[10px] text-blue-600 mt-0.5 block">Memerlukan verifikasi awal</span>
        </div>
        <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 shadow-xs">
          <span className="text-xs text-amber-700 font-medium block">Dalam Proses / Tindak Lanjut</span>
          <span className="text-2xl font-black text-amber-900 mt-1 block">{metrics.diproses}</span>
          <span className="text-[10px] text-amber-600 mt-0.5 block">Sedang ditindaklanjuti tim</span>
        </div>
        <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 shadow-xs">
          <span className="text-xs text-emerald-700 font-medium block">Tuntas Ditangani</span>
          <span className="text-2xl font-black text-emerald-900 mt-1 block">{metrics.tuntas}</span>
          <span className="text-[10px] text-emerald-600 mt-0.5 block">Selesai &amp; jawaban terkirim</span>
        </div>
      </div>

      {/* Control Bar (Filters & Search) */}
      <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Status Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setSelectedStatus(f.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedStatus === f.key
                    ? 'bg-[#AF191A] text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 text-xs border border-neutral-200 rounded-lg bg-white text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-[#AF191A]"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aspirasi berdasarkan nama pelapor, perihal, nomor kontak, atau wilayah..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-200 rounded-lg bg-neutral-50 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#AF191A] transition-all"
          />
          <svg
            className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 text-xs text-neutral-400 hover:text-neutral-600"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Aspirations Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200">
              <tr>
                <th className="py-3 px-4">Tanggal Masuk</th>
                <th className="py-3 px-4">Pelapor &amp; Kontak</th>
                <th className="py-3 px-4">Wilayah</th>
                <th className="py-3 px-4">Kategori &amp; Perihal</th>
                <th className="py-3 px-4">Status Alur Kerja</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-neutral-400 text-xs">
                    Tidak ada data aspirasi yang cocok dengan kriteria pencarian atau filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-neutral-50/80 transition-colors cursor-pointer group"
                    onClick={() => handleOpenDetail(item)}
                  >
                    <td className="py-3.5 px-4 whitespace-nowrap text-neutral-500">
                      <span className="block font-medium text-neutral-800">
                        {new Date(item.created_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-[10px] text-neutral-400">
                        {new Date(item.created_at).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}{' '}
                        WITA
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-neutral-900 block group-hover:text-[#AF191A] transition-colors">
                        {item.name}
                      </span>
                      <span className="text-[11px] font-mono text-neutral-500">
                        {item.contact}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-neutral-600">
                      <span className="block font-medium text-neutral-800">
                        {item.regency || '-'}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {item.district || '-'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="inline-block px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] font-semibold text-neutral-600">
                          {item.category || 'Umum'}
                        </span>
                        {item.internal_note && (
                          <span
                            className="inline-flex items-center gap-0.5 text-[10px] text-amber-600 font-bold bg-amber-50 px-1 rounded border border-amber-200"
                            title="Memiliki catatan internal"
                          >
                            <span>&#9998;</span> Catatan
                          </span>
                        )}
                        {item.attachment_url && (
                          <span
                            className="inline-flex items-center gap-0.5 text-[10px] text-neutral-500 font-bold bg-neutral-100 px-1 rounded border border-neutral-200"
                            title="Memiliki berkas lampiran"
                          >
                            <span>&#128206;</span> File
                          </span>
                        )}
                      </div>
                      <p className="font-medium text-neutral-900 line-clamp-1">
                        {item.subject}
                      </p>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${getStatusBadge(
                          item.status
                        )}`}
                      >
                        {getStatusDisplayName(item.status)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetail(item);
                        }}
                        className="px-3 py-1.5 rounded-lg border border-neutral-300 bg-white hover:border-[#AF191A] hover:text-[#AF191A] text-neutral-700 font-semibold text-xs transition-colors shadow-2xs"
                      >
                        Buka Detail &rarr;
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <AspirationDetailModal
        aspiration={activeAspiration}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onUpdated={handleUpdated}
      />
    </div>
  );
}
