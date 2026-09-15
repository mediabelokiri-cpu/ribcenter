'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Activity, ActivityCategory, ActivityType, ContentStatus } from '@/types/database';
import { createActivityAction, updateActivityAction } from './actions';
import { slugify } from '@/lib/slug';

interface ActivityFormProps {
  initialData?: Activity | null;
  categories: ActivityCategory[];
  isEditing?: boolean;
}

export function ActivityForm({ initialData, categories, isEditing = false }: ActivityFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [type, setType] = useState<ActivityType>(initialData?.type || 'REKAM_KERJA');
  const [categoryId, setCategoryId] = useState(initialData?.category_id || '');
  const [date, setDate] = useState(initialData?.date || new Date().toISOString().split('T')[0]);
  const [location, setLocation] = useState(initialData?.location || '');
  const [regency, setRegency] = useState(initialData?.regency || '');
  const [district, setDistrict] = useState(initialData?.district || '');
  const [summary, setSummary] = useState(initialData?.summary || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [beneficiaries, setBeneficiaries] = useState(initialData?.beneficiaries?.toString() || '0');
  const [status, setStatus] = useState<ContentStatus>(initialData?.status || 'PUBLISHED');
  const [featured, setFeatured] = useState(initialData?.featured || false);
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || '');
  const [videoUrl, setVideoUrl] = useState(initialData?.video_url || '');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isEditing && !slug) {
      setSlug(slugify(val));
    }
  };

  const handleGenerateSlug = () => {
    if (title) {
      setSlug(slugify(title));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.set('title', title);
    formData.set('slug', slug);
    formData.set('type', type);
    formData.set('category_id', categoryId);
    formData.set('date', date);
    formData.set('location', location);
    formData.set('regency', regency);
    formData.set('district', district);
    formData.set('summary', summary);
    formData.set('description', description);
    formData.set('beneficiaries', beneficiaries);
    formData.set('status', status);
    formData.set('featured', featured.toString());
    formData.set('cover_image_url', coverImageUrl);
    formData.set('video_url', videoUrl);

    startTransition(async () => {
      if (isEditing && initialData) {
        const res = await updateActivityAction(initialData.id, formData);
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal menyimpan perubahan.');
        } else {
          setSuccessMessage('Rekam kerja berhasil diperbarui.');
          router.refresh();
        }
      } else {
        const res = await createActivityAction(formData);
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal menambahkan rekam kerja.');
        } else {
          setSuccessMessage('Rekam kerja berhasil dibuat.');
          router.push('/admin/rekam-kerja');
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <Link
            href="/admin/rekam-kerja"
            className="text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1 mb-1"
          >
            &larr; Kembali ke Daftar Rekam Kerja
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            {isEditing ? 'Sunting Rekam Kerja' : 'Tambah Rekam Kerja Baru'}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {isEditing && slug && (
            <Link
              href={`/rekam-kerja/${slug}`}
              target="_blank"
              className="px-3 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              Lihat Halaman Publik &rarr;
            </Link>
          )}
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 disabled:opacity-50 shadow-sm transition-opacity"
          >
            {isPending ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Buat Rekam Kerja'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3 text-xs bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 rounded-lg">
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-3 text-xs bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 rounded-lg">
          {errorMessage}
        </div>
      )}

      {/* SECTION 1: INFORMASI UTAMA */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
          1. Informasi Utama
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Judul Kegiatan / Program <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Penyaluran Bantuan Bibit Kakao Unggul Kelompok Tani"
              className="w-full px-3 py-2 text-sm border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div className="sm:col-span-2">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Slug URL Publik <span className="text-rose-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSlug}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Generate dari Judul
                </button>
              </div>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="penyaluran-bantuan-bibit-kakao"
                className="w-full px-3 py-2 text-xs font-mono border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <span className="text-[10px] text-neutral-400 mt-1 block">
                URL Publik: /rekam-kerja/{slug || '[slug]'}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Tanggal Pelaksanaan <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                Tipe Kegiatan <span className="text-rose-500">*</span>
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as ActivityType)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              >
                <option value="REKAM_KERJA">REKAM KERJA (Kerja &amp; Advokasi Nyata)</option>
                <option value="PROGRAM">PROGRAM (Inisiatif &amp; Penyaluran Bantuan)</option>
                <option value="KEGIATAN">KEGIATAN (Pelatihan, Sosialisasi &amp; Kunjungan)</option>
                <option value="RESES">RESES (Penjaringan Aspirasi Masa Sidang)</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Kategori Taksonomi
                </label>
                <Link
                  href="/admin/rekam-kerja/kategori"
                  target="_blank"
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  + Kelola Kategori
                </Link>
              </div>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
              >
                <option value="">-- Pilih Kategori (Opsional) --</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {!c.is_active ? '(Non-aktif)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: WILAYAH / LOKASI */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
          2. Wilayah &amp; Lokasi
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Kabupaten / Kota
            </label>
            <input
              type="text"
              value={regency}
              onChange={(e) => setRegency(e.target.value)}
              placeholder="Contoh: Polewali Mandar"
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Kecamatan / Desa
            </label>
            <input
              type="text"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="Contoh: Tinambung"
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Lokasi Spesifik / Venue
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Contoh: Balai Pertemuan Desa"
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: NARASI & PENERIMA MANFAAT */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
          3. Deskripsi &amp; Konteks Publik
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Ringkasan Singkat (Summary)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="1-2 kalimat ikhtisar untuk kartu ringkasan dan preview..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Deskripsi Lengkap Kegiatan <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={8}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Uraian latar belakang, proses advokasi, hasil pencapaian, dan dampak nyata..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 leading-relaxed font-sans"
            />
          </div>

          <div className="max-w-xs">
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Estimasi Penerima Manfaat (Orang/Kelompok)
            </label>
            <input
              type="number"
              min={0}
              value={beneficiaries}
              onChange={(e) => setBeneficiaries(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
            />
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Isi 0 jika tidak ada data estimasi numerik langsung.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 4: DOKUMENTASI & VIDEO */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            4. Dokumentasi &amp; Video Eksternal
          </h2>
          <span className="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-neutral-500">
            Titik Integrasi Phase 5
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              URL Foto Dokumentasi / Sampul
            </label>
            <input
              type="url"
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="https://images.example.com/dokumentasi.jpg"
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
            />
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Foto dokumentasi utama untuk ditampilkan pada halaman detail.
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              URL Video Eksternal (YouTube / Vimeo)
            </label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-mono"
            />
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Video eksternal akan disematkan secara responsif.
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 5: PUBLIKASI & STATUS */}
      <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
          5. Status Publikasi &amp; Unggulan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
              Status Editorial <span className="text-rose-500">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 font-semibold"
            >
              <option value="PUBLISHED">PUBLISHED (Diterbitkan untuk Publik)</option>
              <option value="DRAFT">DRAFT (Konsep Internal - Rahasia)</option>
              <option value="ARCHIVED">ARCHIVED (Diarsipkan - Nonaktif)</option>
            </select>
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Catatan: Status DRAFT dan ARCHIVED tidak akan pernah tampil di halaman publik pengunjung.
            </span>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-start gap-3 text-xs font-semibold text-neutral-700 dark:text-neutral-300 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-neutral-300 dark:border-neutral-700 text-neutral-900 focus:ring-neutral-900"
              />
              <div>
                <span>Tandai Sebagai Rekam Kerja Unggulan (Featured)</span>
                <span className="block font-normal text-[11px] text-neutral-400 mt-0.5">
                  Aktivitas unggulan akan diprioritaskan tampil pada seksi Highlight di Beranda publik.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Submit Bar */}
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <Link
          href="/admin/rekam-kerja"
          className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 disabled:opacity-50 shadow-sm transition-opacity"
        >
          {isPending ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Buat Rekam Kerja'}
        </button>
      </div>
    </form>
  );
}
