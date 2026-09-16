'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { slugify } from '@/lib/slug';
import type { Album, MediaItem, ContentStatus } from '@/types/database';
import { MediaPickerModal } from '@/components/media/media-picker-modal';
import {
  createAlbumAction,
  updateAlbumAction,
  attachMediaToAlbumAction,
  detachMediaFromAlbumAction,
} from '../actions';

interface AlbumFormProps {
  initialData?: Album | null;
  initialMedia?: MediaItem[];
  allUnassignedMedia?: MediaItem[];
}

export function AlbumForm({
  initialData,
  initialMedia = [],
  allUnassignedMedia = [],
}: AlbumFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData);

  // Form Fields
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugCustom, setIsSlugCustom] = useState(false);
  const [description, setDescription] = useState(initialData?.description || '');
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || '');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [orderIndex, setOrderIndex] = useState(initialData?.order_index || 0);
  const [status, setStatus] = useState<ContentStatus>(initialData?.status || 'PUBLISHED');

  // Media attachment state
  const [attachedMedia, setAttachedMedia] = useState<MediaItem[]>(initialMedia);
  const [isAttachModalOpen, setIsAttachModalOpen] = useState(false);
  const [selectedToAttach, setSelectedToAttach] = useState<string[]>([]);

  // Modals & Pending state
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Handle title change and auto-slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!isSlugCustom && !isEditing) {
      setSlug(slugify(val));
    }
  };

  // Form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.set('title', title);
    formData.set('slug', slug);
    formData.set('description', description);
    formData.set('cover_image_url', coverImageUrl);
    formData.set('featured', featured ? 'true' : 'false');
    formData.set('order_index', String(orderIndex));
    formData.set('status', status);

    startTransition(async () => {
      if (isEditing && initialData) {
        const res = await updateAlbumAction(initialData.id, formData);
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal memperbarui album.');
        } else {
          setSuccessMessage('Album berhasil diperbarui.');
          router.refresh();
        }
      } else {
        const res = await createAlbumAction(formData);
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal membuat album baru.');
        } else {
          setSuccessMessage('Album baru berhasil dibuat.');
          router.push('/admin/media/album');
          router.refresh();
        }
      }
    });
  };

  // Detach photo from album
  const handleDetachPhoto = (mediaId: string) => {
    startTransition(async () => {
      const res = await detachMediaFromAlbumAction(mediaId);
      if (!res.success) {
        setErrorMessage(res.error || 'Gagal melepaskan foto.');
      } else {
        setAttachedMedia((prev) => prev.filter((m) => m.id !== mediaId));
        setSuccessMessage('Foto dilepas dari album ini.');
      }
    });
  };

  // Attach selected photos
  const handleConfirmAttach = () => {
    if (!initialData || selectedToAttach.length === 0) return;

    startTransition(async () => {
      const res = await attachMediaToAlbumAction(selectedToAttach, initialData.id);
      if (!res.success) {
        setErrorMessage(res.error || 'Gagal menautkan foto.');
      } else {
        // Update local list
        const newlyAttached = allUnassignedMedia.filter((m) =>
          selectedToAttach.includes(m.id)
        );
        setAttachedMedia((prev) => [...prev, ...newlyAttached]);
        setIsAttachModalOpen(false);
        setSelectedToAttach([]);
        setSuccessMessage('Foto berhasil ditambahkan ke album.');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-[#AF191A] rounded-xl text-xs flex justify-between items-center shadow-xs">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage(null)} className="font-bold ml-4">&times;</button>
        </div>
      )}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex justify-between items-center shadow-xs">
          <span>{successMessage}</span>
          <button type="button" onClick={() => setSuccessMessage(null)} className="font-bold ml-4">&times;</button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/admin/media/album"
              className="text-xs font-semibold text-neutral-500 hover:text-[#AF191A]"
            >
              &larr; Kembali ke Daftar Album
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#191919]">
            {isEditing && initialData ? `Sunting: ${initialData.title}` : 'Buat Album Galeri Baru'}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Dokumentasi foto kegiatan dan album visual publikasi resmi.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/media/album"
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 text-neutral-700 hover:border-[#AF191A] hover:text-[#AF191A] bg-white transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] disabled:opacity-50 shadow-xs transition-colors"
          >
            {isPending ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Terbitkan Album'}
          </button>
        </div>
      </div>

      {/* SECTION 1: INFORMASI UTAMA ALBUM */}
      <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
          1. Identitas &amp; Deskripsi Album
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Judul Album <span className="text-[#AF191A]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={handleTitleChange}
              placeholder="Contoh: Kunjungan Kerja Peninjauan Irigasi Pertanian..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] font-medium focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-neutral-700">
                Slug URL Album <span className="text-[#AF191A]">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsSlugCustom(!isSlugCustom)}
                className="text-[11px] text-[#AF191A] hover:underline"
              >
                {isSlugCustom ? 'Gunakan Auto-Slug' : 'Ubah Manual'}
              </button>
            </div>
            <div className="flex items-center">
              <span className="inline-flex items-center px-3 py-2 rounded-l-lg border border-r-0 border-neutral-300 bg-neutral-50 text-neutral-500 font-mono text-xs">
                /galeri/foto/
              </span>
              <input
                type="text"
                required
                readOnly={!isSlugCustom && !isEditing}
                value={slug}
                onChange={(e) => setSlug(slugify(e.target.value))}
                className={`w-full px-3 py-2 text-xs border border-neutral-300 rounded-r-lg font-mono focus:outline-none focus:ring-1 focus:ring-[#AF191A] ${
                  !isSlugCustom && !isEditing
                    ? 'bg-neutral-50 text-neutral-600'
                    : 'bg-white text-[#191919]'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Deskripsi Singkat Album
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan latar belakang kegiatan, lokasi, dan konteks rangkaian foto dalam album ini..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: FOTO SAMPUL & PENGATURAN TAMPILAN */}
      <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
          2. Foto Sampul &amp; Status Publikasi
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Foto Sampul Album (Cover URL)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="https://... atau pilih dari Pustaka Media"
                className="flex-1 px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] font-mono focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
              <button
                type="button"
                onClick={() => setIsCoverPickerOpen(true)}
                className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <span>🖼️</span> Pilih dari Pustaka Media
              </button>
            </div>

            {coverImageUrl && (
              <div className="mt-3 p-2 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-3">
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="w-24 h-16 object-cover rounded border border-neutral-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="text-xs">
                  <span className="font-semibold text-neutral-800 block">Pratinjau Sampul Terpilih</span>
                  <span className="text-[11px] text-neutral-400 font-mono truncate block max-w-sm">
                    {coverImageUrl}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Status Publikasi
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ContentStatus)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              >
                <option value="PUBLISHED">PUBLISHED (Diterbitkan)</option>
                <option value="DRAFT">DRAFT (Draf Rahasia)</option>
                <option value="ARCHIVED">ARCHIVED (Diarsipkan)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Nomor Urutan Tampilan
              </label>
              <input
                type="number"
                min="0"
                value={orderIndex}
                onChange={(e) => setOrderIndex(parseInt(e.target.value, 10) || 0)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] font-mono focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>

            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#AF191A] rounded border-neutral-300 focus:ring-[#AF191A]"
                />
                <span className="text-xs font-semibold text-neutral-800">
                  Tandai sebagai Album Unggulan (★ Featured)
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 3: DAFTAR FOTO DALAM ALBUM */}
      {isEditing && (
        <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
                3. Foto Terlampir Dalam Album ({attachedMedia.length})
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Foto-foto berikut ini otomatis tampil di halaman detail album publik.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAttachModalOpen(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] shadow-xs flex items-center gap-1.5"
            >
              <span>+</span> Tambah Foto ke Album
            </button>
          </div>

          {attachedMedia.length === 0 ? (
            <div className="p-8 text-center bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
              <span className="text-3xl block mb-2">📷</span>
              <p className="text-xs text-neutral-600 font-medium">Belum ada foto yang ditautkan ke album ini.</p>
              <button
                type="button"
                onClick={() => setIsAttachModalOpen(true)}
                className="mt-2 text-xs text-[#AF191A] font-semibold hover:underline"
              >
                Pilih Foto dari Pustaka Media
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {attachedMedia.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative rounded-lg border border-neutral-200 overflow-hidden bg-neutral-100 aspect-square"
                >
                  <img
                    src={photo.file_url}
                    alt={photo.alt_text || photo.title || ''}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                    <span className="text-[10px] text-white font-medium line-clamp-1">
                      {photo.title || 'Foto'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDetachPhoto(photo.id)}
                      disabled={isPending}
                      className="text-[10px] py-1 px-2 rounded bg-red-600 text-white font-semibold hover:bg-red-700 shadow-xs"
                    >
                      Lepas
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* COVER IMAGE PICKER MODAL */}
      <MediaPickerModal
        isOpen={isCoverPickerOpen}
        onClose={() => setIsCoverPickerOpen(false)}
        onSelect={(url) => setCoverImageUrl(url)}
        title="Pilih Foto Sampul Album"
      />

      {/* ATTACH MEDIA MODAL */}
      {isAttachModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-neutral-200 space-y-4 max-h-[85vh] flex flex-col text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-bold text-[#191919]">Pilih Foto untuk Album</h3>
                <p className="text-xs text-neutral-400">Pilih dari foto yang belum memiliki album.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAttachModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-700 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-[250px]">
              {allUnassignedMedia.length === 0 ? (
                <div className="p-8 text-center text-neutral-400">
                  Semua foto di Pustaka Media sudah memiliki album atau belum ada foto yang diunggah.
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {allUnassignedMedia.map((item) => {
                    const isChecked = selectedToAttach.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (isChecked) {
                            setSelectedToAttach((prev) => prev.filter((id) => id !== item.id));
                          } else {
                            setSelectedToAttach((prev) => [...prev, item.id]);
                          }
                        }}
                        className={`aspect-square rounded-lg border-2 cursor-pointer relative overflow-hidden bg-neutral-100 ${
                          isChecked ? 'border-[#AF191A] ring-2 ring-[#AF191A]/30' : 'border-neutral-200'
                        }`}
                      >
                        <img
                          src={item.file_url}
                          alt={item.title || ''}
                          className="w-full h-full object-cover"
                        />
                        {isChecked && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#AF191A] text-white text-[10px] flex items-center justify-center font-bold">
                            ✓
                          </div>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] p-1 truncate text-center">
                          {item.title || 'Foto'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
              <span className="text-neutral-500">
                {selectedToAttach.length} foto terpilih
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsAttachModalOpen(false)}
                  className="px-4 py-1.5 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleConfirmAttach}
                  disabled={selectedToAttach.length === 0 || isPending}
                  className="px-5 py-1.5 rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] disabled:opacity-50 font-semibold shadow-xs"
                >
                  {isPending ? 'Menautkan...' : 'Masukkan ke Album'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
