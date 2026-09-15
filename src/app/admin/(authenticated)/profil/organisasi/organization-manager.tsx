'use client';

import { useState, useActionState } from 'react';
import type { Organization } from '@/types/database';
import {
  createOrganizationAction,
  updateOrganizationAction,
  deleteOrganizationAction,
  togglePublishOrganizationAction,
  type OrgActionState,
} from './actions';

export function OrganizationManager({ initialItems }: { initialItems: Organization[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingItem, setEditingItem] = useState<Organization | null>(null);

  const [createState, createAction, isCreatePending] = useActionState<OrgActionState, FormData>(
    async (prev, formData) => {
      const res = await createOrganizationAction(prev, formData);
      if (res.success) setIsAdding(false);
      return res;
    },
    {}
  );

  const [updateState, updateAction, isUpdatePending] = useActionState<OrgActionState, FormData>(
    async (prev, formData) => {
      const res = await updateOrganizationAction(prev, formData);
      if (res.success) setEditingItem(null);
      return res;
    },
    {}
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs text-neutral-500">
            Total {initialItems.length} riwayat organisasi tercatat
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsAdding(!isAdding);
            setEditingItem(null);
          }}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] transition-colors"
        >
          {isAdding ? 'Batal Tambah' : '+ Tambah Organisasi Baru'}
        </button>
      </div>

      {/* Form Tambah Baru */}
      {isAdding && (
        <form
          action={createAction}
          className="p-6 rounded-xl bg-white dark:bg-[#191919] border border-neutral-300 dark:border-neutral-700 shadow-sm space-y-4"
        >
          <h2 className="text-sm font-bold text-[#191919] dark:text-white">
            Tambah Riwayat Organisasi Baru
          </h2>

          {createState?.error && (
            <div className="p-3 text-xs rounded bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300">
              {createState.error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Nama Organisasi *</label>
              <input
                name="organization_name"
                type="text"
                required
                placeholder="Contoh: Himpunan Mahasiswa / Dewan Pimpinan"
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Peran / Jabatan *</label>
              <input
                name="role"
                type="text"
                required
                placeholder="Contoh: Ketua / Koordinator Wilayah"
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Periode Mulai *</label>
              <input
                name="period_start"
                type="text"
                required
                placeholder="Contoh: 2018"
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Periode Selesai</label>
              <input
                name="period_end"
                type="text"
                placeholder="Contoh: 2022 atau Sekarang"
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Nomor Urut</label>
              <input
                name="order_index"
                type="number"
                defaultValue={initialItems.length + 1}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Deskripsi &amp; Kontribusi</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Deskripsi peran, tanggung jawab, dan program yang dipimpin..."
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
            />
          </div>

          <div className="flex justify-between items-center pt-2">
            <label className="flex items-center gap-2 text-xs cursor-pointer">
              <input name="is_published" type="checkbox" defaultChecked className="rounded" />
              <span>Publikasikan ke situs</span>
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
                className="px-4 py-1.5 text-xs font-semibold rounded bg-[#AF191A] hover:bg-[#8e1415] text-white disabled:opacity-50 transition-colors"
              >
                {isCreatePending ? 'Menyimpan...' : 'Simpan Organisasi'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Form Edit */}
      {editingItem && (
        <form
          action={updateAction}
          className="p-6 rounded-xl bg-white dark:bg-[#191919] border-2 border-[#AF191A] shadow-sm space-y-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-[#AF191A] dark:text-[#FFCC00]">
              Edit Organisasi: {editingItem.organization_name}
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Nama Organisasi *</label>
              <input
                name="organization_name"
                type="text"
                required
                defaultValue={editingItem.organization_name}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Peran / Jabatan *</label>
              <input
                name="role"
                type="text"
                required
                defaultValue={editingItem.role}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1">Periode Mulai *</label>
              <input
                name="period_start"
                type="text"
                required
                defaultValue={editingItem.period_start}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Periode Selesai</label>
              <input
                name="period_end"
                type="text"
                defaultValue={editingItem.period_end || ''}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">Nomor Urut</label>
              <input
                name="order_index"
                type="number"
                defaultValue={editingItem.order_index}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Deskripsi &amp; Kontribusi</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={editingItem.description || ''}
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#AF191A]"
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
                className="px-4 py-1.5 text-xs font-semibold rounded bg-[#AF191A] hover:bg-[#8e1415] text-white disabled:opacity-50 transition-colors"
              >
                {isUpdatePending ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Daftar Organisasi */}
      <div className="bg-white dark:bg-[#191919] rounded-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {initialItems.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-500">
            Belum ada rekam organisasi yang ditambahkan.
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
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-[#191919] dark:text-white">
                      {item.period_start} {item.period_end ? `- ${item.period_end}` : ''}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        item.is_published
                          ? 'bg-[#FFCC00]/20 text-[#191919] dark:text-[#FFCC00]'
                          : 'bg-neutral-200 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                      }`}
                    >
                      {item.is_published ? 'TERBIT' : 'DRAFT'}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-[#191919] dark:text-white">
                    {item.organization_name}
                  </h3>
                  <p className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                    Peran: {item.role}
                  </p>
                  {item.description && (
                    <p className="text-xs text-neutral-500 line-clamp-1">{item.description}</p>
                  )}
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <form action={togglePublishOrganizationAction}>
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

                  <form action={deleteOrganizationAction}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      onClick={(e) => {
                        if (!confirm('Yakin ingin menghapus organisasi ini?')) {
                          e.preventDefault();
                        }
                      }}
                      className="px-2.5 py-1 text-[11px] rounded text-[#AF191A] hover:bg-[#AF191A]/10 transition-colors"
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
