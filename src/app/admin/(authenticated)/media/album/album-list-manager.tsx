'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import type { Album, ContentStatus } from '@/types/database';
import {
  toggleAlbumStatusAction,
  toggleAlbumFeaturedAction,
  deleteAlbumAction,
} from '../actions';

interface AlbumListManagerProps {
  initialAlbums: Album[];
  mediaCounts: Record<string, number>;
}

export function AlbumListManager({ initialAlbums, mediaCounts }: AlbumListManagerProps) {
  const [albums] = useState<Album[]>(initialAlbums);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | ContentStatus>('ALL');
  const [deletingAlbum, setDeletingAlbum] = useState<Album | null>(null);

  const [isPending, startTransition] = useTransition();
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const filteredAlbums = useMemo(() => {
    return albums.filter((alb) => {
      if (statusFilter !== 'ALL' && alb.status !== statusFilter) {
        return false;
      }
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesTitle = alb.title.toLowerCase().includes(q);
        const matchesDesc = alb.description?.toLowerCase().includes(q);
        const matchesSlug = alb.slug.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesSlug) return false;
      }
      return true;
    });
  }, [albums, statusFilter, search]);

  const handleStatusToggle = (albumId: string, currentStatus: ContentStatus) => {
    const nextStatus: ContentStatus =
      currentStatus === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';

    startTransition(async () => {
      const res = await toggleAlbumStatusAction(albumId, nextStatus);
      if (!res.success) {
        setActionError(res.error || 'Gagal mengubah status album.');
      } else {
        setActionSuccess(`Status album diubah menjadi ${nextStatus}.`);
        window.location.reload();
      }
    });
  };

  const handleFeaturedToggle = (albumId: string, currentFeatured: boolean) => {
    startTransition(async () => {
      const res = await toggleAlbumFeaturedAction(albumId, !currentFeatured);
      if (!res.success) {
        setActionError(res.error || 'Gagal mengubah status unggulan.');
      } else {
        setActionSuccess('Status unggulan berhasil diperbarui.');
        window.location.reload();
      }
    });
  };

  const handleDeleteConfirm = () => {
    if (!deletingAlbum) return;

    startTransition(async () => {
      const res = await deleteAlbumAction(deletingAlbum.id);
      if (!res.success) {
        setActionError(res.error || 'Gagal menghapus album.');
      } else {
        setActionSuccess('Album berhasil dihapus.');
        setDeletingAlbum(null);
        window.location.reload();
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Messages */}
      {actionError && (
        <div className="p-4 bg-red-50 border border-red-200 text-[#AF191A] rounded-xl text-xs flex justify-between items-center shadow-xs">
          <span>{actionError}</span>
          <button onClick={() => setActionError(null)} className="font-bold ml-4">&times;</button>
        </div>
      )}
      {actionSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex justify-between items-center shadow-xs">
          <span>{actionSuccess}</span>
          <button onClick={() => setActionSuccess(null)} className="font-bold ml-4">&times;</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#191919]">
            Manajemen Album Galeri
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Kelola kumpulan album foto kegiatan, liputan lapangan, dan arsip visual dokumentasi.
          </p>
        </div>

        <Link
          href="/admin/media/album/tambah"
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] transition-colors shadow-xs flex items-center gap-1.5"
        >
          <span>+</span> Buat Album Baru
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-xl border border-neutral-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari album berdasarkan judul atau deskripsi..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
          />
          <span className="absolute left-3 top-2.5 text-neutral-400 text-xs">🔍</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {(
            [
              { key: 'ALL', label: 'Semua Status' },
              { key: 'PUBLISHED', label: 'Terbit' },
              { key: 'DRAFT', label: 'Draf' },
              { key: 'ARCHIVED', label: 'Arsip' },
            ] as const
          ).map((chip) => (
            <button
              key={chip.key}
              onClick={() => setStatusFilter(chip.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                statusFilter === chip.key
                  ? 'bg-[#191919] text-white font-bold'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Album Table / Grid */}
      {filteredAlbums.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-neutral-200 shadow-xs space-y-2">
          <span className="text-3xl block">📚</span>
          <p className="text-sm font-semibold text-neutral-700">Tidak ada album ditemukan</p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Belum ada album foto yang sesuai dengan kriteria pencarian atau status yang dipilih.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-neutral-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#191919]">
              <thead className="bg-neutral-50 text-neutral-500 font-semibold border-b border-neutral-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Album</th>
                  <th className="py-3 px-4">Jumlah Foto</th>
                  <th className="py-3 px-4">Urutan</th>
                  <th className="py-3 px-4">Unggulan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredAlbums.map((album) => {
                  const count = mediaCounts[album.id] || 0;
                  const isPub = album.status === 'PUBLISHED';

                  return (
                    <tr key={album.id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Album Info */}
                      <td className="py-3 px-4 flex items-center gap-3">
                        <div className="w-14 h-11 rounded-lg bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {album.cover_image_url ? (
                            <img
                              src={album.cover_image_url}
                              alt={album.title}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/file.svg';
                              }}
                            />
                          ) : (
                            <span className="text-sm">🖼️</span>
                          )}
                        </div>
                        <div>
                          <Link
                            href={`/admin/media/album/${album.id}/edit`}
                            className="font-bold text-neutral-900 hover:text-[#AF191A] transition-colors line-clamp-1"
                          >
                            {album.title}
                          </Link>
                          <span className="text-[11px] font-mono text-neutral-400 block">
                            /{album.slug}
                          </span>
                        </div>
                      </td>

                      {/* Photo Count */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-mono font-bold bg-neutral-100 text-neutral-700 border border-neutral-200">
                          📷 {count} Foto
                        </span>
                      </td>

                      {/* Order */}
                      <td className="py-3 px-4 font-mono text-neutral-500">
                        #{album.order_index}
                      </td>

                      {/* Featured */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleFeaturedToggle(album.id, album.featured)}
                          disabled={isPending}
                          className={`text-base transition-transform hover:scale-125 ${
                            album.featured ? 'text-[#FFCC00]' : 'text-neutral-300 hover:text-neutral-400'
                          }`}
                          title={album.featured ? 'Status Unggulan Aktif' : 'Jadikan Unggulan'}
                        >
                          ★
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(album.id, album.status)}
                          disabled={isPending}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide transition-colors ${
                            isPub
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : album.status === 'DRAFT'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                          }`}
                        >
                          {album.status}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right space-x-2">
                        {isPub && (
                          <Link
                            href={`/galeri/foto/${album.slug}`}
                            target="_blank"
                            className="text-neutral-500 hover:text-[#AF191A] font-medium"
                            title="Pratinjau Publik"
                          >
                            Lihat ↗
                          </Link>
                        )}
                        <Link
                          href={`/admin/media/album/${album.id}/edit`}
                          className="text-[#AF191A] hover:underline font-semibold"
                        >
                          Sunting
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeletingAlbum(album)}
                          className="text-neutral-400 hover:text-red-600 ml-2"
                          title="Hapus Album"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingAlbum && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-neutral-200 text-center space-y-4 text-xs">
            <span className="text-4xl block">⚠️</span>
            <div>
              <h3 className="text-base font-bold text-[#191919]">Hapus Album Ini?</h3>
              <p className="text-neutral-500 mt-1">
                Album &ldquo;{deletingAlbum.title}&rdquo; akan dihapus. Foto-foto di dalamnya akan dilepas dari album tetapi tetap tersimpan aman di Pustaka Media.
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingAlbum(null)}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isPending}
                className="px-5 py-2 rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] disabled:opacity-50 font-semibold shadow-xs"
              >
                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
