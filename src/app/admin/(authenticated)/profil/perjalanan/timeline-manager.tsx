'use client';

import { useState, useActionState } from 'react';
import type { TimelineItem, TimelineCategory } from '@/types/database';
import {
  createTimelineAction,
  updateTimelineAction,
  deleteTimelineAction,
  togglePublishTimelineAction,
  type TimelineActionState,
} from './actions';

export function TimelineManager({ initialItems }: { initialItems: TimelineItem[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<TimelineItem | null>(null);

  const [createState, createAction, isCreatePending] = useActionState<TimelineActionState, FormData>(
    async (prev, formData) => {
      const res = await createTimelineAction(prev, formData);
      if (res.success) setIsAdding(false);
      return res;
    },
    {}
  );

  const [updateState, updateAction, isUpdatePending] = useActionState<TimelineActionState, FormData>(
    async (prev, formData) => {
      const res = await updateTimelineAction(prev, formData);
      if (res.success) setEditingItem(null);
      return res;
    },
    {}
  );

  const categories: TimelineCategory[] = [
    'POLITIK',
    'ORGANISASI',
    'KARIER',
    'PENDIDIKAN',
    'LAINNYA',
  ];

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-neutral-500">
            Total {initialItems.length} tonggak perjalanan tercatat
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingItem(null);
          }}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity"
        >
          {isAdding ? 'Batal Tambah' : '+ Tambah Perjalanan Baru'}
        </button>
      </div>

      {/* Form Tambah Baru */}
      {isAdding && (
        <form
          action={createAction}
          className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-sm space-y-4"
        >
          <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            Tambah Tonggak Perjalanan Baru
          </h2>

          {createState?.error && (
            <div className="p-3 text-xs rounded bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
              {createState.error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1">Judul Tonggak / Peristiwa *</label>
              <input
                name="title"
                type="text"
                required
                placeholder="Contoh: Mengemban Amanah Pengabdian Wilayah"
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Kategori *</label>
              <select
                name="category"
                defaultValue="POLITIK"
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Tahun Mulai *</label>
              <input
                name="year_start"
                type="number"
                required
                placeholder="2024"
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Tahun Selesai (Opsional)</label>
              <input
                name="year_end"
                type="number"
                placeholder="Kosongkan jika masih berjalan"
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Nomor Urut Tampil</label>
              <input
                name="order_index"
                type="number"
                defaultValue={initialItems.length + 1}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Deskripsi Lengkap *</label>
            <textarea
              name="description"
              rows={3}
              required
              placeholder="Jelaskan peran, capaian, dan dinamika peristiwa secara objektif..."
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input name="is_published" type="checkbox" defaultChecked className="rounded" />
              <span>Publikasikan langsung ke situs</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isCreatePending}
                className="px-4 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 disabled:opacity-50"
              >
                {isCreatePending ? 'Menyimpan...' : 'Simpan Linimasa'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Form Edit */}
      {editingItem && (
        <form
          action={updateAction}
          className="p-6 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-300 dark:border-amber-800 shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-amber-900 dark:text-amber-200">
              Edit Linimasa: {editingItem.title}
            </h2>
            <button
              type="button"
              onClick={() => setEditingItem(null)}
              className="text-xs text-neutral-500 hover:text-neutral-800"
            >
              Tutup
            </button>
          </div>

          <input type="hidden" name="id" value={editingItem.id} />

          {updateState?.error && (
            <div className="p-3 text-xs rounded bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
              {updateState.error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium mb-1">Judul Tonggak *</label>
              <input
                name="title"
                type="text"
                required
                defaultValue={editingItem.title}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Kategori *</label>
              <select
                name="category"
                defaultValue={editingItem.category}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Tahun Mulai *</label>
              <input
                name="year_start"
                type="number"
                required
                defaultValue={editingItem.year_start}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Tahun Selesai</label>
              <input
                name="year_end"
                type="number"
                defaultValue={editingItem.year_end || ''}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Nomor Urut</label>
              <input
                name="order_index"
                type="number"
                defaultValue={editingItem.order_index}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Deskripsi Lengkap *</label>
            <textarea
              name="description"
              rows={3}
              required
              defaultValue={editingItem.description}
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input
                name="is_published"
                type="checkbox"
                defaultChecked={editingItem.is_published}
                className="rounded"
              />
              <span>Publikasikan ke situs</span>
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-3 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-700"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isUpdatePending}
                className="px-4 py-1.5 text-xs font-semibold rounded bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 disabled:opacity-50"
              >
                {isUpdatePending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Daftar Linimasa */}
      <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {initialItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            Belum ada linimasa yang ditambahkan.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {initialItems.map((item) => (
              <div
                key={item.id}
                className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                      {item.year_start} {item.year_end ? `- ${item.year_end}` : '- Sekarang'}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.is_published
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {item.is_published ? 'TERBIT' : 'DRAFT'}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                    {item.title}
                  </h3>
                  <p className="text-xs text-neutral-500 line-clamp-1">{item.description}</p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <form action={togglePublishTimelineAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="current_status" value={item.is_published ? 'true' : 'false'} />
                    <button
                      type="submit"
                      className="px-2.5 py-1 text-[11px] rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    >
                      {item.is_published ? 'Jadikan Draft' : 'Terbitkan'}
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={() => {
                      setEditingItem(item);
                      setIsAdding(false);
                    }}
                    className="px-2.5 py-1 text-[11px] rounded border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    Edit
                  </button>

                  <form action={deleteTimelineAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      onClick={(e) => {
                        if (!confirm('Yakin ingin menghapus linimasa ini?')) {
                          e.preventDefault();
                        }
                      }}
                      className="px-2.5 py-1 text-[11px] rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50"
                    >
                      Hapus
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
