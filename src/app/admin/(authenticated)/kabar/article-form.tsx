/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Article, ArticleType, ContentStatus, Activity } from '@/types/database';
import { createArticleAction, updateArticleAction } from './actions';
import { slugify } from '@/lib/slug';
import { MediaPickerModal } from '@/components/media/media-picker-modal';

interface ArticleFormProps {
  initialData?: Article | null;
  activities?: Activity[];
  defaultType?: ArticleType;
}

export function ArticleForm({
  initialData,
  activities = [],
  defaultType = 'BERITA',
}: ArticleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isEditing = !!initialData;

  // Form states
  const [type, setType] = useState<ArticleType>(initialData?.type || defaultType);
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(isEditing);
  const [category, setCategory] = useState(initialData?.category || '');
  const [author, setAuthor] = useState(initialData?.author || 'Rahmat Ichwan Bahtiar');
  const [publishedAt, setPublishedAt] = useState(
    initialData?.published_at
      ? new Date(initialData.published_at).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.cover_image_url || '');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [relatedActivityId, setRelatedActivityId] = useState(initialData?.related_activity_id || '');
  const [seoTitle, setSeoTitle] = useState(initialData?.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(initialData?.seo_description || '');
  const [status, setStatus] = useState<ContentStatus>(initialData?.status || 'PUBLISHED');
  const [featured, setFeatured] = useState<boolean>(initialData?.featured || false);

  // Editor tab: 'write' or 'preview'
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slugManuallyEdited) {
      setSlug(slugify(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlugManuallyEdited(true);
    setSlug(slugify(val));
  };

  // Content formatting toolbar helper
  const insertFormat = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('article-content-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentText = textarea.value;
    const selectedText = currentText.substring(start, end);

    const newText =
      currentText.substring(0, start) +
      prefix +
      selectedText +
      suffix +
      currentText.substring(end);

    setContent(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      );
    }, 0);
  };

  const suggestedCategories = [
    'Kebijakan Publik',
    'Advokasi',
    'Opini',
    'Pembangunan',
    'Pertanian',
    'Pendidikan',
    'Kesehatan',
    'Publikasi',
  ];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.set('type', type);
    formData.set('title', title);
    formData.set('slug', slug);
    formData.set('category', category);
    formData.set('author', author);
    formData.set('published_at', publishedAt ? new Date(publishedAt).toISOString() : '');
    formData.set('cover_image_url', coverImageUrl);
    formData.set('excerpt', excerpt);
    formData.set('content', content);
    formData.set('related_activity_id', relatedActivityId);
    formData.set('seo_title', seoTitle);
    formData.set('seo_description', seoDescription);
    formData.set('status', status);
    formData.set('featured', featured ? 'true' : 'false');

    startTransition(async () => {
      if (isEditing && initialData) {
        const res = await updateArticleAction(initialData.id, formData);
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal menyimpan perubahan artikel.');
        } else {
          setSuccessMessage('Artikel berhasil diperbarui.');
          router.refresh();
        }
      } else {
        const res = await createArticleAction(formData);
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal menerbitkan artikel.');
        } else {
          setSuccessMessage('Artikel baru berhasil dibuat.');
          const targetUrl = type === 'GAGASAN' ? '/admin/kabar/gagasan' : '/admin/kabar/berita';
          router.push(targetUrl);
          router.refresh();
        }
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={type === 'GAGASAN' ? '/admin/kabar/gagasan' : '/admin/kabar/berita'}
              className="text-xs font-semibold text-neutral-500 hover:text-[#AF191A]"
            >
              &larr; Kembali ke Daftar {type === 'GAGASAN' ? 'Gagasan' : 'Berita'}
            </Link>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#191919]">
            {isEditing ? `Sunting: ${initialData.title}` : `Tulis ${type === 'GAGASAN' ? 'Gagasan Baru' : 'Berita Baru'}`}
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Format artikel terpadu untuk publikasi informasi dan pemikiran publik.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/kabar"
            className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 text-neutral-700 hover:border-[#AF191A] hover:text-[#AF191A] bg-white transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] disabled:opacity-50 shadow-xs transition-colors"
          >
            {isPending ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 text-xs bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium">
          ✓ {successMessage}
        </div>
      )}
      {errorMessage && (
        <div className="p-4 text-xs bg-rose-50 border border-rose-200 text-rose-800 rounded-xl font-medium">
          ✕ {errorMessage}
        </div>
      )}

      {/* SECTION 1: INFORMASI UTAMA & KLASIFIKASI */}
      <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
          1. Klasifikasi &amp; Informasi Utama
        </h2>

        {/* Type Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-2">
            Tipe Publikasi <span className="text-[#AF191A]">*</span>
          </label>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <button
              type="button"
              onClick={() => setType('BERITA')}
              className={`p-3 rounded-xl border text-left transition-all ${
                type === 'BERITA'
                  ? 'border-[#AF191A] bg-[#AF191A]/5 ring-1 ring-[#AF191A]'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${type === 'BERITA' ? 'bg-[#AF191A]' : 'bg-neutral-300'}`}></span>
                <span className="font-bold text-xs text-[#191919]">BERITA</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Laporan kegiatan, program lapangan, siaran pers, dan dokumentasi kerja.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setType('GAGASAN')}
              className={`p-3 rounded-xl border text-left transition-all ${
                type === 'GAGASAN'
                  ? 'border-[#AF191A] bg-[#AF191A]/5 ring-1 ring-[#AF191A]'
                  : 'border-neutral-200 bg-white hover:border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${type === 'GAGASAN' ? 'bg-[#AF191A]' : 'bg-neutral-300'}`}></span>
                <span className="font-bold text-xs text-[#191919]">GAGASAN</span>
              </div>
              <p className="text-[11px] text-neutral-500 mt-1">
                Artikel pemikiran kebijakan, opini, esai analisis, dan refleksi visi daerah.
              </p>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Judul Artikel <span className="text-[#AF191A]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Contoh: Mengawal Percepatan Pembangunan Infrastruktur Desa di Mandar"
              className="w-full px-3.5 py-2.5 text-sm border border-neutral-300 rounded-lg bg-white text-[#191919] font-medium focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Slug URL <span className="text-[#AF191A]">*</span>
            </label>
            <div className="flex items-center">
              <span className="px-3 py-2 text-xs bg-neutral-100 border border-r-0 border-neutral-300 rounded-l-lg text-neutral-500 font-mono">
                /kabar/
              </span>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="mengawal-percepatan-pembangunan-desa"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-r-lg bg-white text-[#191919] font-mono focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Kategori Artikel
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Contoh: Kebijakan Publik"
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
              <div className="flex flex-wrap gap-1 mt-1.5">
                {suggestedCategories.slice(0, 4).map((sc) => (
                  <button
                    key={sc}
                    type="button"
                    onClick={() => setCategory(sc)}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors"
                  >
                    +{sc}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Nama Penulis
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Tanggal Publikasi
              </label>
              <input
                type="date"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: SAMPUL & RINGKASAN */}
      <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
          2. Sampul &amp; Ringkasan Eksekutif
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              URL Foto Sampul (Cover Image)
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
                onClick={() => setIsPickerOpen(true)}
                className="px-3 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white hover:bg-neutral-800 transition-colors shrink-0 shadow-xs flex items-center gap-1.5"
              >
                <span>🖼️</span> Pilih Media
              </button>
            </div>
            {coverImageUrl && (
              <div className="mt-2 p-2 bg-neutral-50 border border-neutral-200 rounded-lg flex items-center gap-3">
                <img
                  src={coverImageUrl}
                  alt="Preview Sampul"
                  className="w-20 h-14 object-cover rounded border border-neutral-200"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="text-[11px] text-neutral-500 font-mono truncate">
                  {coverImageUrl}
                </span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Ringkasan Singkat (Excerpt) <span className="text-[#AF191A]">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="1-2 paragraf ringkas yang menggambarkan inti pokok berita atau gagasan ini untuk pratinjau kartu dan hasil pencarian..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] leading-relaxed focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: ISI KONTEN LENGKAP & TOOLBAR */}
      <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
            3. Isi Konten Artikel <span className="text-[#AF191A]">*</span>
          </h2>

          {/* Tab Write / Preview */}
          <div className="inline-flex rounded-lg border border-neutral-200 p-0.5 bg-neutral-50 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'write'
                  ? 'bg-white text-[#AF191A] font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Tulis Konten
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'bg-white text-[#AF191A] font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Pratinjau Baca
            </button>
          </div>
        </div>

        {/* Markdown Shortcut Toolbar */}
        {activeTab === 'write' && (
          <div className="flex flex-wrap items-center gap-1.5 p-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs">
            <button
              type="button"
              onClick={() => insertFormat('**', '**')}
              className="px-2 py-1 bg-white border border-neutral-200 rounded font-bold hover:bg-neutral-100"
              title="Tebal (Bold)"
            >
              B
            </button>
            <button
              type="button"
              onClick={() => insertFormat('*', '*')}
              className="px-2 py-1 bg-white border border-neutral-200 rounded italic hover:bg-neutral-100"
              title="Miring (Italic)"
            >
              I
            </button>
            <button
              type="button"
              onClick={() => insertFormat('## ')}
              className="px-2 py-1 bg-white border border-neutral-200 rounded font-semibold hover:bg-neutral-100"
              title="Subjudul H2"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => insertFormat('### ')}
              className="px-2 py-1 bg-white border border-neutral-200 rounded font-semibold hover:bg-neutral-100"
              title="Subjudul H3"
            >
              H3
            </button>
            <button
              type="button"
              onClick={() => insertFormat('> ')}
              className="px-2 py-1 bg-white border border-neutral-200 rounded hover:bg-neutral-100"
              title="Kutipan (Quote)"
            >
              “ ”
            </button>
            <button
              type="button"
              onClick={() => insertFormat('- ')}
              className="px-2 py-1 bg-white border border-neutral-200 rounded hover:bg-neutral-100"
              title="Daftar Poin (List)"
            >
              • List
            </button>
            <button
              type="button"
              onClick={() => insertFormat('[Judul Tautan](', ')')}
              className="px-2 py-1 bg-white border border-neutral-200 rounded hover:bg-neutral-100"
              title="Tautan (Link)"
            >
              🔗 Link
            </button>
          </div>
        )}

        {/* Write or Preview Body */}
        {activeTab === 'write' ? (
          <div>
            <textarea
              id="article-content-textarea"
              rows={14}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis uraian lengkap artikel di sini. Dukung pemformatan teks, subjudul, kutipan, dan poin-poin..."
              className="w-full px-3.5 py-3 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] leading-relaxed font-sans focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
            />
            <span className="text-[10px] text-neutral-400 mt-1 block">
              Gunakan toolbar di atas atau sintaks markdown standar untuk menata struktur artikel.
            </span>
          </div>
        ) : (
          <div className="p-5 border border-neutral-200 rounded-lg bg-white min-h-[300px] text-xs leading-relaxed space-y-3">
            {content ? (
              <div className="space-y-3 text-neutral-800 whitespace-pre-wrap font-sans">
                {content}
              </div>
            ) : (
              <p className="text-neutral-400 italic">Belum ada konten yang ditulis.</p>
            )}
          </div>
        )}
      </div>

      {/* SECTION 4: REKAM KERJA TERKAIT */}
      <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
          4. Rekam Kerja &amp; Program Terkait (Opsional)
        </h2>
        <p className="text-xs text-neutral-500">
          Hubungkan artikel ini dengan rekam kerja/kegiatan lapangan yang relevan agar pembaca dapat menelusuri data akuntabilitas terkait.
        </p>

        <div>
          <label className="block text-xs font-semibold text-neutral-700 mb-1">
            Pilih Rekam Kerja Terkait
          </label>
          <select
            value={relatedActivityId}
            onChange={(e) => setRelatedActivityId(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
          >
            <option value="">-- Tidak Terhubung ke Rekam Kerja Khusus --</option>
            {activities.map((act) => (
              <option key={act.id} value={act.id}>
                [{act.type}] {act.title} ({act.date})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SECTION 5: METADATA SEO */}
      <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
          5. Optimasi Mesin Pencari (SEO)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Meta Title (Judul Tab &amp; Google)
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              placeholder={title ? `${title} - Rahmat Ichwan Bahtiar` : 'Judul artikel - Rahmat Ichwan Bahtiar'}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Meta Description
            </label>
            <input
              type="text"
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              placeholder="Deskripsi ringkas 150-160 karakter untuk pratinjau mesin pencari..."
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
            />
          </div>
        </div>
      </div>

      {/* SECTION 6: STATUS PUBLIKASI & UNGGULAN */}
      <div className="p-6 bg-white border border-neutral-200 rounded-xl shadow-xs space-y-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
          6. Status Publikasi &amp; Penampilan
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Status Editorial <span className="text-[#AF191A]">*</span>
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as ContentStatus)}
              className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] font-semibold focus:ring-1 focus:ring-[#AF191A]"
            >
              <option value="PUBLISHED">PUBLISHED (Diterbitkan untuk Publik)</option>
              <option value="DRAFT">DRAFT (Konsep Internal - Rahasia)</option>
              <option value="ARCHIVED">ARCHIVED (Diarsipkan - Tidak Tampil)</option>
            </select>
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Artikel dengan status DRAFT dan ARCHIVED tidak akan pernah dapat diakses publik.
            </span>
          </div>

          <div className="pt-2">
            <label className="inline-flex items-start gap-3 text-xs font-semibold text-neutral-700 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-neutral-300 text-[#AF191A] focus:ring-[#AF191A]"
              />
              <div>
                <span>Tandai Sebagai Artikel Unggulan (Featured)</span>
                <span className="block font-normal text-[11px] text-neutral-500 mt-0.5">
                  Artikel unggulan akan diprioritaskan tampil pada Sorotan Beranda dan puncak halaman Kabar.
                </span>
              </div>
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Submit Bar */}
      <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
        <Link
          href={type === 'GAGASAN' ? '/admin/kabar/gagasan' : '/admin/kabar/berita'}
          className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 text-neutral-700 hover:border-[#AF191A] hover:text-[#AF191A] bg-white transition-colors"
        >
          Batal
        </Link>
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-xs font-semibold rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] disabled:opacity-50 shadow-xs transition-colors"
        >
          {isPending ? 'Menyimpan...' : isEditing ? 'Simpan Perubahan' : 'Terbitkan Artikel'}
        </button>
      </div>

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(url) => setCoverImageUrl(url)}
        title="Pilih Sampul Berita & Gagasan"
      />
    </form>
  );
}
