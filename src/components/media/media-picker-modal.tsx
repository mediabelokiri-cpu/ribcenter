'use client';

/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useTransition } from 'react';
import type { MediaItem } from '@/types/database';
import { uploadMediaAction } from '@/app/admin/(authenticated)/media/actions';

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string, item?: MediaItem) => void;
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  title = 'Pilih Media dari Pustaka',
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Upload form state
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let ignore = false;
    async function loadMedia() {
      try {
        const res = await fetch('/api/media?type=IMAGE');
        if (!res.ok) throw new Error('API not available');
        const data = await res.json();
        if (!ignore && Array.isArray(data)) {
          setMediaList(data);
        }
      } catch {
        // Fallback default
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadMedia();

    return () => {
      ignore = true;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredMedia = mediaList.filter((m) => {
    if (m.media_type !== 'IMAGE') return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (m.title && m.title.toLowerCase().includes(q)) ||
      (m.caption && m.caption.toLowerCase().includes(q)) ||
      m.file_url.toLowerCase().includes(q)
    );
  });

  const handleUploadSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUploadError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    startTransition(async () => {
      const res = await uploadMediaAction(formData);
      if (!res.success || !res.data) {
        setUploadError(res.error || 'Gagal mengunggah berkas.');
      } else {
        onSelect(res.data.file_url, res.data);
        onClose();
      }
    });
  };

  const handleConfirmSelect = () => {
    if (selectedItem) {
      onSelect(selectedItem.file_url, selectedItem);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-neutral-200 space-y-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
          <div>
            <h2 className="text-base font-bold text-[#191919]">{title}</h2>
            <p className="text-xs text-neutral-400">Pilih aset visual yang sudah ada atau unggah foto baru.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 text-lg font-bold"
          >
            &times;
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('library')}
            className={`pb-2 px-4 font-semibold transition-colors border-b-2 ${
              activeTab === 'library'
                ? 'border-[#AF191A] text-[#AF191A]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            Pustaka Media
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2 px-4 font-semibold transition-colors border-b-2 ${
              activeTab === 'upload'
                ? 'border-[#AF191A] text-[#AF191A]'
                : 'border-transparent text-neutral-500 hover:text-neutral-800'
            }`}
          >
            + Unggah Baru
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto min-h-[300px] text-xs">
          {activeTab === 'library' ? (
            <div className="space-y-3">
              {/* Search Bar */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari foto di pustaka..."
                className="w-full px-3 py-2 border border-neutral-300 rounded-lg text-xs text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />

              {isLoading ? (
                <div className="p-12 text-center text-neutral-400">Memuat berkas media...</div>
              ) : filteredMedia.length === 0 ? (
                <div className="p-12 text-center text-neutral-400 space-y-2">
                  <span className="text-3xl block">🖼️</span>
                  <p>Belum ada gambar yang sesuai di Pustaka Media.</p>
                  <button
                    type="button"
                    onClick={() => setActiveTab('upload')}
                    className="px-3 py-1.5 rounded-lg bg-[#AF191A] text-white text-xs font-semibold"
                  >
                    Unggah Foto Sekarang
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {filteredMedia.map((m) => {
                    const isSelected = selectedItem?.id === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedItem(m)}
                        className={`group aspect-square rounded-lg overflow-hidden border-2 cursor-pointer relative bg-neutral-100 ${
                          isSelected ? 'border-[#AF191A] ring-2 ring-[#AF191A]/30' : 'border-neutral-200 hover:border-neutral-400'
                        }`}
                      >
                        <img
                          src={m.file_url}
                          alt={m.alt_text || ''}
                          className="w-full h-full object-cover"
                        />
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#AF191A] text-white text-[10px] flex items-center justify-center font-bold shadow-xs">
                            ✓
                          </div>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] p-1 truncate text-center">
                          {m.title || 'Foto'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleUploadSubmit} className="space-y-4 max-w-md mx-auto pt-4">
              {uploadError && (
                <div className="p-3 bg-red-50 text-[#AF191A] border border-red-200 rounded-lg text-xs">
                  {uploadError}
                </div>
              )}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Pilih Gambar <span className="text-[#AF191A]">*</span>
                </label>
                <input
                  type="file"
                  name="file"
                  required
                  accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-neutral-50 text-[#191919]"
                />
                <p className="text-[10px] text-neutral-400 mt-1">Maksimal ukuran 5 MB (JPG, PNG, WebP).</p>
              </div>

              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Judul Foto (Opsional)
                </label>
                <input
                  type="text"
                  name="title"
                  placeholder="Nama foto..."
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg bg-white text-[#191919]"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-2.5 rounded-lg bg-[#AF191A] text-white font-semibold hover:bg-[#8e1415] disabled:opacity-50"
              >
                {isPending ? 'Mengunggah & Memilih...' : 'Unggah & Gunakan'}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        {activeTab === 'library' && (
          <div className="flex justify-between items-center pt-3 border-t border-neutral-100">
            <span className="text-xs text-neutral-500 truncate max-w-xs">
              {selectedItem ? `Terpilih: ${selectedItem.title || selectedItem.file_url}` : 'Pilih foto di atas'}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg border border-neutral-300 text-neutral-600 hover:bg-neutral-50 text-xs font-medium"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSelect}
                disabled={!selectedItem}
                className="px-5 py-1.5 rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] disabled:opacity-40 text-xs font-semibold shadow-xs"
              >
                Gunakan Foto Ini
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
