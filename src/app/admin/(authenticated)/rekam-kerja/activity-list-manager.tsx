'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import type { ActivityCategory, ActivityType, ContentStatus } from '@/types/database';
import type { ActivityWithCategory } from '@/services/activities';
import {
  deleteActivityAction,
  togglePublishActivityAction,
  toggleFeaturedActivityAction,
} from './actions';

interface ActivityListManagerProps {
  initialActivities: ActivityWithCategory[];
  categories: ActivityCategory[];
}

export function ActivityListManager({
  initialActivities,
  categories,
}: ActivityListManagerProps) {
  const [activities, setActivities] = useState<ActivityWithCategory[]>(initialActivities);
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Filter items in memory
  const filteredActivities = activities.filter((act) => {
    if (typeFilter !== 'ALL' && act.type !== typeFilter) return false;
    if (categoryFilter !== 'ALL' && act.category_id !== categoryFilter) return false;
    if (statusFilter !== 'ALL' && act.status !== statusFilter) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = act.title.toLowerCase().includes(q);
      const matchSummary = act.summary?.toLowerCase().includes(q) ?? false;
      const matchLocation = act.location?.toLowerCase().includes(q) ?? false;
      const matchRegency = act.regency?.toLowerCase().includes(q) ?? false;
      if (!matchTitle && !matchSummary && !matchLocation && !matchRegency) return false;
    }

    return true;
  });

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus rekam kerja: "${title}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await deleteActivityAction(id);
      if (!res.success) {
        setErrorMessage(res.error || 'Gagal menghapus rekam kerja.');
      } else {
        setSuccessMessage('Rekam kerja berhasil dihapus.');
        setActivities((prev) => prev.filter((a) => a.id !== id));
      }
    });
  };

  const handleToggleStatus = (id: string, currentStatus: ContentStatus) => {
    const nextStatus: ContentStatus = currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await togglePublishActivityAction(id, nextStatus);
      if (!res.success) {
        setErrorMessage(res.error || 'Gagal mengubah status publikasi.');
      } else {
        setSuccessMessage(`Status diubah menjadi ${nextStatus}.`);
        setActivities((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: nextStatus } : a))
        );
      }
    });
  };

  const handleToggleFeatured = (id: string, currentFeatured: boolean) => {
    const nextFeatured = !currentFeatured;
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await toggleFeaturedActivityAction(id, nextFeatured);
      if (!res.success) {
        setErrorMessage(res.error || 'Gagal mengubah status unggulan.');
      } else {
        setSuccessMessage(nextFeatured ? 'Ditandai sebagai unggulan.' : 'Dihapus dari unggulan.');
        setActivities((prev) =>
          prev.map((a) => (a.id === id ? { ...a, featured: nextFeatured } : a))
        );
      }
    });
  };

  const getTypeBadge = (type: ActivityType) => {
    switch (type) {
      case 'REKAM_KERJA':
        return 'bg-[#AF191A]/10 text-[#AF191A] border-[#AF191A]/30';
      case 'PROGRAM':
        return 'bg-[#191919] text-white border-neutral-700';
      case 'KEGIATAN':
        return 'bg-[#FFCC00]/20 text-[#191919] border-[#FFCC00]/50';
      case 'RESES':
        return 'bg-purple-50 text-purple-900 border border-purple-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#191919]">
            Rekam Kerja &amp; Program
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Kelola arsip pertanggungjawaban publik, kegiatan advokasi, program bantuan, dan catatan reses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/rekam-kerja/kategori"
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-neutral-300 hover:border-[#AF191A] text-neutral-700 transition-colors"
          >
            Kelola Kategori ({categories.length})
          </Link>
          <Link
            href="/admin/rekam-kerja/tambah"
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] shadow-xs transition-colors"
          >
            + Tambah Rekam Kerja
          </Link>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-3 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="sm:col-span-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul, ringkasan, lokasi..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#AF191A]"
            />
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#AF191A]"
            >
              <option value="ALL">Semua Tipe Kegiatan</option>
              <option value="REKAM_KERJA">Rekam Kerja</option>
              <option value="PROGRAM">Program</option>
              <option value="KEGIATAN">Kegiatan</option>
              <option value="RESES">Reses</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#AF191A]"
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#AF191A]"
            >
              <option value="ALL">Semua Status</option>
              <option value="PUBLISHED">Published (Tayang)</option>
              <option value="DRAFT">Draft (Konsep)</option>
              <option value="ARCHIVED">Archived (Arsip)</option>
            </select>
          </div>
        </div>

        {/* Count summary and reset */}
        <div className="flex justify-between items-center text-[11px] text-neutral-500 pt-1">
          <span>
            Menampilkan {filteredActivities.length} dari {activities.length} total rekaman
          </span>
          {(searchQuery || typeFilter !== 'ALL' || categoryFilter !== 'ALL' || statusFilter !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('ALL');
                setTypeFilter('ALL');
                setCategoryFilter('ALL');
                setStatusFilter('ALL');
              }}
              className="text-[#AF191A] underline font-semibold hover:opacity-80"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Activities Table */}
      <div className="border border-neutral-200 rounded-xl bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-neutral-50 text-neutral-900 font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3">Kegiatan / Program</th>
                <th className="px-4 py-3 w-32">Tipe</th>
                <th className="px-4 py-3 w-40">Kategori</th>
                <th className="px-4 py-3 w-28">Tanggal</th>
                <th className="px-4 py-3 w-36">Wilayah</th>
                <th className="px-4 py-3 w-24">Status</th>
                <th className="px-4 py-3 w-20 text-center">Featured</th>
                <th className="px-4 py-3 w-32 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-neutral-400">
                    Tidak ada data rekam kerja yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-neutral-50/70">
                    {/* Title and summary with Cover Thumbnail */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {act.cover_image_url ? (
                          <img
                            src={act.cover_image_url}
                            alt=""
                            className="w-12 h-9 object-cover rounded-md border border-neutral-200 shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-9 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center text-[10px] text-neutral-400 shrink-0 font-mono">
                            🏛️
                          </div>
                        )}
                        <div className="min-w-0">
                          <Link
                            href={`/admin/rekam-kerja/${act.id}/edit`}
                            className="font-semibold text-neutral-900 hover:text-[#AF191A] line-clamp-1 block transition-colors"
                          >
                            {act.title}
                          </Link>
                          <div className="text-[11px] text-neutral-400 font-mono line-clamp-1">
                            /{act.slug}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Type Badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-semibold border rounded ${getTypeBadge(
                          act.type
                        )}`}
                      >
                        {act.type}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3 text-neutral-700">
                      {act.category?.name || <span className="text-neutral-400 italic">Tanpa Kategori</span>}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 font-mono text-neutral-600">
                      {act.date}
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3 text-neutral-500">
                      {act.regency ? `${act.regency}` : act.location || '-'}
                    </td>

                    {/* Status Badge & quick toggle */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(act.id, act.status)}
                        disabled={isPending}
                        title="Klik untuk mengubah status"
                        className={`px-2 py-0.5 text-[10px] font-semibold rounded cursor-pointer transition-opacity ${
                          act.status === 'PUBLISHED'
                            ? 'bg-[#FFCC00]/20 text-[#191919]'
                            : act.status === 'DRAFT'
                            ? 'bg-neutral-100 text-neutral-700'
                            : 'bg-neutral-50 text-neutral-500'
                        }`}
                      >
                        {act.status}
                      </button>
                    </td>

                    {/* Featured Toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(act.id, act.featured)}
                        disabled={isPending}
                        className={`text-sm transition-opacity ${
                          act.featured
                            ? 'text-[#FFCC00] hover:opacity-80'
                            : 'text-neutral-300 hover:text-neutral-400'
                        }`}
                        title={act.featured ? 'Unggulan (Aktif)' : 'Bukan Unggulan'}
                      >
                        ★
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right space-x-2">
                      <Link
                        href={`/admin/rekam-kerja/${act.id}/edit`}
                        className="text-neutral-800 hover:text-[#AF191A] font-semibold"
                      >
                        Sunting
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(act.id, act.title)}
                        disabled={isPending}
                        className="text-[#AF191A] hover:underline font-semibold"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
