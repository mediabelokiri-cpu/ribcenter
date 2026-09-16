'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useTransition, useMemo } from 'react';
import type { MediaItem, Album, MediaType } from '@/types/database';
import {
  uploadMediaAction,
  createVideoMediaAction,
  updateMediaAction,
  deleteMediaAction,
} from './actions';

interface MediaLibraryManagerProps {
  initialMedia: MediaItem[];
  albums: Album[];
}

export function MediaLibraryManager({ initialMedia, albums }: MediaLibraryManagerProps) {
  const [mediaList] = useState<MediaItem[]>(initialMedia);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | MediaType>('ALL');
  const [albumFilter, setAlbumFilter] = useState<string>('ALL');

  // Modals state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<MediaItem | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  // Form states
  const [isPending, startTransition] = useTransition();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  // Filtered media
  const filteredMedia = useMemo(() => {
    return mediaList.filter((item) => {
      // Type filter
      if (typeFilter !== 'ALL' && item.media_type !== typeFilter) {
        return false;
      }
      // Album filter
      if (albumFilter !== 'ALL') {
        if (albumFilter === 'UNASSIGNED') {
          if (item.album_id !== null) return false;
        } else if (item.album_id !== albumFilter) {
          return false;
        }
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title?.toLowerCase().includes(q);
        const matchesCaption = item.caption?.toLowerCase().includes(q);
        const matchesAlt = item.alt_text?.toLowerCase().includes(q);
        const matchesUrl = item.file_url.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCaption && !matchesAlt && !matchesUrl) {
          return false;
        }
      }
      return true;
    });
  }, [mediaList, typeFilter, albumFilter, searchQuery]);

  // Copy URL
  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.file_url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Upload handler
  const handleUploadSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await uploadMediaAction(formData);
      if (!res.success) {
        setActionError(res.error || 'Gagal mengunggah berkas.');
      } else {
        setActionSuccess('Berkas berhasil diunggah ke Pustaka Media.');
        setIsUploadOpen(false);
        form.reset();
        window.location.reload();
      }
    });
  };

  // Video submit handler
  const handleVideoSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setActionError(null);
    setActionSuccess(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await createVideoMediaAction(formData);
      if (!res.success) {
        setActionError(res.error || 'Gagal menyimpan video.');
      } else {
        setActionSuccess('Video eksternal berhasil ditambahkan ke Pustaka Media.');
        setIsVideoModalOpen(false);
        form.reset();
        window.location.reload();
      }
    });
  };

  // Update handler
  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingItem) return;
    setActionError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await updateMediaAction(editingItem.id, formData);
      if (!res.success) {
        setActionError(res.error || 'Gagal memperbarui metadata media.');
      } else {
        setActionSuccess('Metadata media berhasil diperbarui.');
        setEditingItem(null);
        window.location.reload();
      }
    });
  };

  // Delete handler
  const handleDeleteConfirm = async () => {
    if (!deletingItem) return;
    setActionError(null);

    startTransition(async () => {
      const res = await deleteMediaAction(deletingItem.id);
      if (!res.success) {
        setActionError(res.error || 'Gagal menghapus media.');
      } else {
        setActionSuccess('Media berhasil dihapus.');
        setDeletingItem(null);
        window.location.reload();
      }
    });
  };

  const getAlbumTitle = (albumId: string | null) => {
    if (!albumId) return null;
    const found = albums.find((a) => a.id === albumId);
    return found ? found.title : null;
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

      {/* Action Header & Upload Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl border border-neutral-200 shadow-xs">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-[#191919]">
            Pustaka Media Terpadu
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Pusat repositori aset visual, foto kegiatan, dokumen, dan tautan video resmi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsVideoModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold rounded-lg border border-neutral-300 bg-white text-neutral-700 hover:border-[#AF191A] hover:text-[#AF191A] transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>▶</span> Tambah Video YouTube
          </button>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] transition-colors shadow-xs flex items-center gap-1.5"
          >
            <span>+</span> Unggah Berkas Baru
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-neutral-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          {/* Search Box */}
          <div className="relative flex-1 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari media berdasarkan judul, keterangan, atau nama berkas..."
              className="w-full pl-9 pr-4 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
            />
            <span className="absolute left-3 top-2.5 text-neutral-400 text-xs">🔍</span>
          </div>

          {/* Album Selector Filter */}
          <div className="w-full md:w-64">
            <select
              value={albumFilter}
              onChange={(e) => setAlbumFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
            >
              <option value="ALL">Semua Album</option>
              <option value="UNASSIGNED">Tanpa Album (Mandiri)</option>
              {albums.map((alb) => (
                <option key={alb.id} value={alb.id}>
                  Album: {alb.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Filter Chips */}
        <div className="flex items-center gap-2 pt-1 border-t border-neutral-100 overflow-x-auto text-xs">
          <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mr-1">
            Jenis Media:
          </span>
          {(
            [
              { key: 'ALL', label: 'Semua' },
              { key: 'IMAGE', label: 'Foto / Gambar' },
              { key: 'VIDEO', label: 'Video YouTube' },
              { key: 'DOCUMENT', label: 'Dokumen / PDF' },
            ] as const
          ).map((chip) => (
            <button
              key={chip.key}
              onClick={() => setTypeFilter(chip.key)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors whitespace-nowrap ${
                typeFilter === chip.key
                  ? 'bg-[#AF191A] text-white shadow-xs'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {chip.label}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-neutral-400 font-mono">
            {filteredMedia.length} item ditemukan
          </span>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-neutral-200 shadow-xs">
          <span className="text-3xl block mb-2">📁</span>
          <p className="text-sm font-semibold text-neutral-700">Tidak ada media yang cocok</p>
          <p className="text-xs text-neutral-400 mt-1 max-w-sm mx-auto">
            Coba sesuaikan kata kunci pencarian, filter jenis media, atau unggah berkas baru ke Pustaka Media.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredMedia.map((item) => {
            const albumName = getAlbumTitle(item.album_id);
            const isVideo = item.media_type === 'VIDEO';
            const isDoc = item.media_type === 'DOCUMENT';

            // Extract thumbnail for video
            let displayThumb = item.file_url;
            if (isVideo && typeof item.metadata === 'object' && item.metadata !== null && 'thumbnail_url' in item.metadata) {
              displayThumb = String((item.metadata as Record<string, unknown>).thumbnail_url);
            }

            return (
              <div
                key={item.id}
                className="group relative bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs hover:border-[#AF191A] transition-all flex flex-col"
              >
                {/* Thumbnail Area */}
                <div
                  className="aspect-4/3 bg-neutral-100 relative overflow-hidden flex items-center justify-center cursor-pointer"
                  onClick={() => setPreviewItem(item)}
                >
                  {isDoc ? (
                    <div className="flex flex-col items-center justify-center text-neutral-400 p-4">
                      <span className="text-3xl mb-1">📄</span>
                      <span className="text-[10px] font-mono uppercase font-bold text-neutral-500">PDF</span>
                    </div>
                  ) : (
                    <img
                      src={displayThumb}
                      alt={item.alt_text || item.title || 'Media thumbnail'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/file.svg';
                      }}
                    />
                  )}

                  {/* Badge Media Type */}
                  <span
                    className={`absolute top-2 left-2 text-[9px] font-mono font-bold px-2 py-0.5 rounded shadow-xs ${
                      isVideo
                        ? 'bg-[#AF191A] text-white'
                        : isDoc
                        ? 'bg-amber-600 text-white'
                        : 'bg-[#191919]/80 backdrop-blur text-white'
                    }`}
                  >
                    {item.media_type}
                  </span>

                  {/* Play Icon for Video */}
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-[#AF191A] text-white flex items-center justify-center shadow-md text-xs pl-0.5">
                        ▶
                      </div>
                    </div>
                  )}
                </div>

                {/* Content info */}
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <h3 className="text-xs font-bold text-[#191919] line-clamp-1 group-hover:text-[#AF191A] transition-colors" title={item.title || ''}>
                      {item.title || 'Tanpa Judul'}
                    </h3>
                    {albumName && (
                      <span className="inline-block text-[10px] text-neutral-500 line-clamp-1 mt-0.5">
                        📂 {albumName}
                      </span>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => handleCopyUrl(item)}
                      className="text-[11px] font-mono text-neutral-600 hover:text-[#AF191A] flex items-center gap-1 transition-colors"
                      title="Salin URL Berkas"
                    >
                      <span>{copiedId === item.id ? '✓ Tersalin' : '🔗 Salin'}</span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setEditingItem(item)}
                        className="text-neutral-400 hover:text-neutral-800 p-1 text-xs"
                        title="Sunting Info"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingItem(item)}
                        className="text-neutral-400 hover:text-[#AF191A] p-1 text-xs"
                        title="Hapus Media"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: UNGGAH BERKAS */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h2 className="text-base font-bold text-[#191919]">Unggah Berkas Media</h2>
              <button
                type="button"
                onClick={() => setIsUploadOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Pilih Berkas <span className="text-[#AF191A]">*</span>
                </label>
                <input
                  type="file"
                  name="file"
                  required
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml,application/pdf"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-[#191919] focus:outline-none"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  Format: JPG, PNG, WebP, GIF, SVG (Maks. 5MB) atau PDF (Maks. 10MB).
                </p>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Judul Media (Opsional)
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Nama foto atau dokumen..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Keterangan Singkat / Caption (Opsional)
                </label>
                <textarea
                  name="caption"
                  rows={2}
                  placeholder="Deskripsi konteks foto atau dokumen..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Masukkan ke Album (Opsional)
                </label>
                <select
                  name="album_id"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
                >
                  <option value="">-- Tanpa Album (Aset Lepas) --</option>
                  {albums.map((alb) => (
                    <option key={alb.id} value={alb.id}>
                      {alb.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] disabled:opacity-50 font-semibold shadow-xs"
                >
                  {isPending ? 'Mengunggah...' : 'Unggah Sekarang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TAMBAH VIDEO YOUTUBE */}
      {isVideoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h2 className="text-base font-bold text-[#191919]">Tambah Video YouTube</h2>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleVideoSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Tautan / URL Video YouTube <span className="text-[#AF191A]">*</span>
                </label>
                <input
                  type="url"
                  name="video_url"
                  required
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-[#191919] font-mono focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
                />
                <p className="text-[10px] text-neutral-400 mt-1">
                  Mendukung tautan YouTube, youtu.be, atau YouTube Shorts.
                </p>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Judul Video <span className="text-[#AF191A]">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="Contoh: Penyerahan Bantuan Alsintan Pertanian..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Keterangan Video (Opsional)
                </label>
                <textarea
                  name="caption"
                  rows={2}
                  placeholder="Ringkasan liputan kegiatan dalam video..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Kaitkan ke Album (Opsional)
                </label>
                <select
                  name="album_id"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
                >
                  <option value="">-- Tanpa Album --</option>
                  {albums.map((alb) => (
                    <option key={alb.id} value={alb.id}>
                      {alb.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] disabled:opacity-50 font-semibold shadow-xs"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Video'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SUNTING METADATA MEDIA */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-neutral-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h2 className="text-base font-bold text-[#191919]">Sunting Informasi Media</h2>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="text-neutral-400 hover:text-neutral-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Judul
                </label>
                <input
                  type="text"
                  name="title"
                  defaultValue={editingItem.title || ''}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Alt Text (Untuk Aksesibilitas Gambar)
                </label>
                <input
                  type="text"
                  name="alt_text"
                  defaultValue={editingItem.alt_text || ''}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Keterangan / Caption
                </label>
                <textarea
                  name="caption"
                  rows={2}
                  defaultValue={editingItem.caption || ''}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
                />
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Tautkan ke Album
                </label>
                <select
                  name="album_id"
                  defaultValue={editingItem.album_id || ''}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
                >
                  <option value="">-- Tanpa Album --</option>
                  {albums.map((alb) => (
                    <option key={alb.id} value={alb.id}>
                      {alb.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2 rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] disabled:opacity-50 font-semibold shadow-xs"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: HAPUS MEDIA */}
      {deletingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-neutral-200 text-center space-y-4">
            <span className="text-4xl block">⚠️</span>
            <div>
              <h3 className="text-base font-bold text-[#191919]">Hapus Media Ini?</h3>
              <p className="text-xs text-neutral-500 mt-1">
                Tindakan ini permanen dan akan menghapus berkas dari pustaka server.
              </p>
            </div>

            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingItem(null)}
                className="px-4 py-2 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50 text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={isPending}
                className="px-5 py-2 rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] disabled:opacity-50 text-xs font-semibold shadow-xs"
              >
                {isPending ? 'Menghapus...' : 'Ya, Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: PREVIEW MEDIA */}
      {previewItem && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full p-4 shadow-2xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-2 border-b border-neutral-200">
              <h3 className="text-xs font-bold text-[#191919] line-clamp-1">
                {previewItem.title || 'Pratinjau Media'}
              </h3>
              <button
                onClick={() => setPreviewItem(null)}
                className="text-neutral-400 hover:text-neutral-800 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {previewItem.media_type === 'IMAGE' ? (
              <div className="max-h-[60vh] flex items-center justify-center overflow-hidden rounded-lg bg-neutral-900">
                <img
                  src={previewItem.file_url}
                  alt={previewItem.alt_text || ''}
                  className="max-h-[60vh] w-auto object-contain"
                />
              </div>
            ) : previewItem.media_type === 'VIDEO' ? (
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                {typeof previewItem.metadata === 'object' &&
                previewItem.metadata !== null &&
                'embed_url' in previewItem.metadata ? (
                  <iframe
                    src={String((previewItem.metadata as Record<string, unknown>).embed_url)}
                    title={previewItem.title || 'Video Player'}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <a
                    href={previewItem.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-full flex items-center justify-center text-white text-xs underline"
                  >
                    Buka Video di Tab Baru
                  </a>
                )}
              </div>
            ) : (
              <div className="p-8 text-center bg-neutral-50 rounded-lg">
                <span className="text-4xl block mb-2">📄</span>
                <p className="text-xs font-semibold text-neutral-700">Dokumen PDF</p>
                <a
                  href={previewItem.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block px-4 py-2 text-xs font-semibold bg-[#AF191A] text-white rounded-lg hover:bg-[#8e1415]"
                >
                  Buka / Unduh Dokumen
                </a>
              </div>
            )}

            <div className="space-y-1 text-xs pt-1">
              {previewItem.caption && (
                <p className="text-neutral-700">{previewItem.caption}</p>
              )}
              <div className="flex items-center justify-between text-[11px] text-neutral-400 font-mono pt-2 border-t border-neutral-100">
                <span className="line-clamp-1">{previewItem.file_url}</span>
                <button
                  type="button"
                  onClick={() => handleCopyUrl(previewItem)}
                  className="text-[#AF191A] font-semibold hover:underline shrink-0 ml-2"
                >
                  {copiedId === previewItem.id ? '✓ Tersalin' : 'Salin URL'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
