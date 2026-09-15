'use client';

import { useState, useTransition } from 'react';
import type { ActivityCategory } from '@/types/database';
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from './actions';
import { slugify } from '@/lib/slug';

interface CategoryManagerProps {
  initialCategories: ActivityCategory[];
}

export function CategoryManager({ initialCategories }: CategoryManagerProps) {
  const [categories, setCategories] = useState<ActivityCategory[]>(initialCategories);
  const [isPending, startTransition] = useTransition();
  const [editingCategory, setEditingCategory] = useState<ActivityCategory | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [orderIndex, setOrderIndex] = useState(1);
  const [isActive, setIsActive] = useState(true);

  const openCreateForm = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setOrderIndex(categories.length + 1);
    setIsActive(true);
    setErrorMessage(null);
    setIsFormOpen(true);
  };

  const openEditForm = (cat: ActivityCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setOrderIndex(cat.order_index);
    setIsActive(cat.is_active);
    setErrorMessage(null);
    setIsFormOpen(true);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCategory) {
      setSlug(slugify(val));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const formData = new FormData();
    formData.set('name', name);
    formData.set('slug', slug);
    formData.set('description', description);
    formData.set('order_index', orderIndex.toString());
    formData.set('is_active', isActive.toString());

    startTransition(async () => {
      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory.id, formData);
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal menyimpan perubahan.');
        } else {
          setSuccessMessage('Kategori berhasil diperbarui.');
          setCategories((prev) =>
            prev.map((c) =>
              c.id === editingCategory.id
                ? {
                    ...c,
                    name,
                    slug,
                    description,
                    order_index: orderIndex,
                    is_active: isActive,
                  }
                : c
            )
          );
          setIsFormOpen(false);
        }
      } else {
        const res = await createCategoryAction(formData);
        if (!res.success) {
          setErrorMessage(res.error || 'Gagal menambahkan kategori.');
        } else {
          setSuccessMessage('Kategori baru berhasil ditambahkan.');
          // Refresh state
          const newCat: ActivityCategory = {
            id: `cat-${Date.now()}`,
            name,
            slug,
            description,
            order_index: orderIndex,
            is_active: isActive,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          setCategories((prev) => [...prev, newCat]);
          setIsFormOpen(false);
        }
      }
    });
  };

  const handleDelete = (id: string, catName: string) => {
    if (!confirm(`Hapus kategori "${catName}"? Aktivitas yang terhubung akan kehilangan referensi kategori.`)) {
      return;
    }
    setErrorMessage(null);
    setSuccessMessage(null);

    startTransition(async () => {
      const res = await deleteCategoryAction(id);
      if (!res.success) {
        setErrorMessage(res.error || 'Gagal menghapus kategori.');
      } else {
        setSuccessMessage('Kategori berhasil dihapus.');
        setCategories((prev) => prev.filter((c) => c.id !== id));
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#191919]">
            Kategori Rekam Kerja
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Kelola taksonomi kategori untuk mengelompokkan kegiatan, program, dan reses.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center justify-center px-4 py-2 text-xs font-semibold rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] shadow-xs transition-colors"
        >
          + Tambah Kategori
        </button>
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

      {/* Modal / Form Drawer */}
      {isFormOpen && (
        <div className="p-6 bg-white border-2 border-[#AF191A] rounded-xl shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
            <h2 className="text-base font-bold text-[#AF191A]">
              {editingCategory ? 'Sunting Kategori' : 'Tambah Kategori Baru'}
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="text-xs text-neutral-400 hover:text-neutral-600"
            >
              Batal
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Nama Kategori <span className="text-[#AF191A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Contoh: Pertanian & Perkebunan"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#AF191A]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Slug URL <span className="text-[#AF191A]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="pertanian-perkebunan"
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#AF191A] font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Deskripsi Singkat
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Penjelasan ringkas cakupan kategori..."
                className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#AF191A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Urutan Tampilan
                </label>
                <input
                  type="number"
                  min={0}
                  value={orderIndex}
                  onChange={(e) => setOrderIndex(parseInt(e.target.value, 10) || 0)}
                  className="w-full px-3 py-2 text-xs border border-neutral-300 rounded-lg bg-white text-[#191919] focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
                />
              </div>

              <div className="pt-5">
                <label className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-300 text-[#AF191A] focus:ring-[#AF191A]"
                  />
                  <span>Kategori Aktif (Dapat dipilih)</span>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-neutral-300 text-neutral-700 hover:border-[#AF191A] hover:text-[#AF191A] bg-white transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] disabled:opacity-50 transition-colors"
              >
                {isPending ? 'Menyimpan...' : 'Simpan Kategori'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="border border-neutral-200 rounded-xl bg-white overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-600">
            <thead className="bg-neutral-50 text-[#191919] font-semibold border-b border-neutral-200">
              <tr>
                <th className="px-4 py-3 w-16">Urutan</th>
                <th className="px-4 py-3">Nama Kategori</th>
                <th className="px-4 py-3">Slug URL</th>
                <th className="px-4 py-3">Deskripsi</th>
                <th className="px-4 py-3 w-24">Status</th>
                <th className="px-4 py-3 w-28 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {categories.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-neutral-400">
                    Belum ada kategori yang dibuat.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-50/70">
                    <td className="px-4 py-3 font-mono font-bold text-neutral-700">
                      {cat.order_index}
                    </td>
                    <td className="px-4 py-3 font-semibold text-[#191919]">
                      {cat.name}
                    </td>
                    <td className="px-4 py-3 font-mono text-neutral-500">
                      {cat.slug}
                    </td>
                    <td className="px-4 py-3 text-neutral-500 max-w-xs truncate">
                      {cat.description || '-'}
                    </td>
                    <td className="px-4 py-3">
                      {cat.is_active ? (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-[#FFCC00]/25 text-[#191919]">
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-neutral-100 text-neutral-600">
                          Non-Aktif
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(cat)}
                        className="text-neutral-700 hover:text-[#AF191A] font-semibold"
                      >
                        Sunting
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
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
