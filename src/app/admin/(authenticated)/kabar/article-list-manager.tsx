'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import type { Article, ArticleType, ContentStatus } from '@/types/database';
import {
  deleteArticleAction,
  toggleArticleStatusAction,
  toggleArticleFeaturedAction,
} from './actions';

interface ArticleListManagerProps {
  initialArticles: Article[];
  defaultTypeFilter?: ArticleType | 'ALL';
  pageTitle?: string;
  pageSubtitle?: string;
}

export function ArticleListManager({
  initialArticles,
  defaultTypeFilter = 'ALL',
  pageTitle = 'Manajemen Kabar & Gagasan',
  pageSubtitle = 'Kelola publikasi berita kegiatan, siaran pers, catatan opini, dan gagasan kebijakan.',
}: ArticleListManagerProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [typeFilter, setTypeFilter] = useState<ArticleType | 'ALL'>(defaultTypeFilter);
  const [statusFilter, setStatusFilter] = useState<ContentStatus | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Statistics
  const totalBerita = articles.filter((a) => a.type === 'BERITA').length;
  const totalGagasan = articles.filter((a) => a.type === 'GAGASAN').length;
  const totalPublished = articles.filter((a) => a.status === 'PUBLISHED').length;
  const totalDraft = articles.filter((a) => a.status === 'DRAFT').length;

  const filteredArticles = articles.filter((a) => {
    if (typeFilter !== 'ALL' && a.type !== typeFilter) return false;
    if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = a.title.toLowerCase().includes(q);
      const matchSlug = a.slug.toLowerCase().includes(q);
      const matchCategory = a.category ? a.category.toLowerCase().includes(q) : false;
      const matchAuthor = a.author.toLowerCase().includes(q);
      if (!matchTitle && !matchSlug && !matchCategory && !matchAuthor) return false;
    }
    return true;
  });

  const handleDelete = (id: string, title: string) => {
    if (!confirm(`Hapus artikel "${title}" secara permanen? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }
    setFeedback(null);

    startTransition(async () => {
      const res = await deleteArticleAction(id);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Artikel berhasil dihapus.' });
        setArticles((prev) => prev.filter((a) => a.id !== id));
      } else {
        setFeedback({ type: 'error', message: res.error || 'Gagal menghapus artikel.' });
      }
    });
  };

  const handleStatusChange = (id: string, newStatus: ContentStatus) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await toggleArticleStatusAction(id, newStatus);
      if (res.success) {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
        );
        setFeedback({ type: 'success', message: `Status diperbarui menjadi ${newStatus}.` });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Gagal mengubah status.' });
      }
    });
  };

  const handleToggleFeatured = (id: string, currentFeatured: boolean) => {
    setFeedback(null);
    startTransition(async () => {
      const res = await toggleArticleFeaturedAction(id, !currentFeatured);
      if (res.success) {
        setArticles((prev) =>
          prev.map((a) => (a.id === id ? { ...a, featured: !currentFeatured } : a))
        );
        setFeedback({
          type: 'success',
          message: !currentFeatured ? 'Artikel ditandai sebagai Unggulan.' : 'Tanda Unggulan dilepas.',
        });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Gagal mengubah status unggulan.' });
      }
    });
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return '-';
    try {
      return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return iso;
    }
  };

  const createHref = defaultTypeFilter === 'GAGASAN'
    ? '/admin/kabar/tambah?type=GAGASAN'
    : defaultTypeFilter === 'BERITA'
    ? '/admin/kabar/tambah?type=BERITA'
    : '/admin/kabar/tambah';

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#AF191A]"></span>
            <span className="text-[10px] font-bold tracking-widest text-[#AF191A] uppercase">
              Modul Publikasi
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#191919]">
            {pageTitle}
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            {pageSubtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={createHref}
            className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] shadow-xs transition-colors"
          >
            + Tulis Artikel Baru
          </Link>
        </div>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Total Berita
          </span>
          <span className="text-2xl font-black text-[#191919]">{totalBerita}</span>
        </div>
        <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
            Total Gagasan
          </span>
          <span className="text-2xl font-black text-[#191919]">{totalGagasan}</span>
        </div>
        <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Diterbitkan (Publik)
          </span>
          <span className="text-2xl font-black text-emerald-600">{totalPublished}</span>
        </div>
        <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Konsep (Draf)
          </span>
          <span className="text-2xl font-black text-amber-600">{totalDraft}</span>
        </div>
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`p-3 text-xs rounded-lg border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border-rose-200 text-rose-800'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="p-4 bg-white border border-neutral-200 rounded-xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter */}
          <div className="inline-flex rounded-lg border border-neutral-200 p-0.5 bg-neutral-50 text-xs">
            <button
              type="button"
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                typeFilter === 'ALL'
                  ? 'bg-white text-[#AF191A] font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Semua Tipe
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('BERITA')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                typeFilter === 'BERITA'
                  ? 'bg-white text-[#AF191A] font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Berita ({totalBerita})
            </button>
            <button
              type="button"
              onClick={() => setTypeFilter('GAGASAN')}
              className={`px-3 py-1 rounded-md font-medium transition-colors ${
                typeFilter === 'GAGASAN'
                  ? 'bg-white text-[#AF191A] font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              Gagasan ({totalGagasan})
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ContentStatus | 'ALL')}
            className="px-3 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
          >
            <option value="ALL">Semua Status</option>
            <option value="PUBLISHED">PUBLISHED (Tayang)</option>
            <option value="DRAFT">DRAFT (Konsep)</option>
            <option value="ARCHIVED">ARCHIVED (Arsip)</option>
          </select>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <input
            type="text"
            placeholder="Cari judul, slug, penulis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-3 pr-8 py-1.5 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-neutral-400 hover:text-neutral-600"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="border border-neutral-200 rounded-xl bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-neutral-50 text-[#191919] font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 w-10 text-center">★</th>
                <th className="px-4 py-3 w-24">Tipe</th>
                <th className="px-4 py-3">Judul &amp; Slug</th>
                <th className="px-4 py-3 w-32">Kategori</th>
                <th className="px-4 py-3 w-28">Tanggal</th>
                <th className="px-4 py-3 w-32">Status</th>
                <th className="px-4 py-3 w-36 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredArticles.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-neutral-400">
                    Tidak ada artikel yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredArticles.map((art) => (
                  <tr key={art.id} className="hover:bg-neutral-50/70 transition-colors">
                    {/* Featured star toggle */}
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(art.id, art.featured)}
                        disabled={isPending}
                        title={art.featured ? 'Artikel Unggulan (Klik untuk lepas)' : 'Bukan Unggulan (Klik untuk jadikan unggulan)'}
                        className={`text-base transition-transform hover:scale-125 ${
                          art.featured ? 'text-[#FFCC00]' : 'text-neutral-300 hover:text-[#FFCC00]'
                        }`}
                      >
                        ★
                      </button>
                    </td>

                    {/* Type badge */}
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                          art.type === 'BERITA'
                            ? 'bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20'
                            : 'bg-neutral-100 text-[#191919] border border-neutral-300'
                        }`}
                      >
                        {art.type}
                      </span>
                    </td>

                    {/* Title and Slug */}
                    <td className="px-4 py-3">
                      <div className="font-semibold text-[#191919] line-clamp-1">
                        {art.title}
                      </div>
                      <div className="text-[11px] font-mono text-neutral-400 line-clamp-1 mt-0.5">
                        /{art.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-neutral-100 text-neutral-700">
                        {art.category || 'Umum'}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-4 py-3 font-mono text-[11px] text-neutral-500 whitespace-nowrap">
                      {formatDate(art.published_at || art.created_at)}
                    </td>

                    {/* Status dropdown */}
                    <td className="px-4 py-3">
                      <select
                        value={art.status}
                        onChange={(e) => handleStatusChange(art.id, e.target.value as ContentStatus)}
                        disabled={isPending}
                        className={`px-2 py-1 text-[11px] font-semibold rounded-md border focus:outline-none ${
                          art.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : art.status === 'DRAFT'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                        }`}
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      {art.status === 'PUBLISHED' && (
                        <Link
                          href={`/kabar/${art.slug}`}
                          target="_blank"
                          className="text-neutral-500 hover:text-[#AF191A] font-medium"
                          title="Buka pratinjau publik"
                        >
                          Lihat ↗
                        </Link>
                      )}
                      <Link
                        href={`/admin/kabar/${art.id}/edit`}
                        className="text-neutral-700 hover:text-[#AF191A] font-semibold"
                      >
                        Sunting
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDelete(art.id, art.title)}
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
