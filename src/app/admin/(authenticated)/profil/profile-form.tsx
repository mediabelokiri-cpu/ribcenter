'use client';

import { useActionState, useState } from 'react';
import { saveProfileAction, type ProfileActionState } from './actions';
import type { Profile } from '@/types/database';

interface EducationItem {
  institution: string;
  degree: string;
  field: string;
  year: string;
}

export function ProfileForm({ initialProfile }: { initialProfile: Profile }) {
  const [state, formAction, isPending] = useActionState<ProfileActionState, FormData>(
    saveProfileAction,
    {}
  );

  const [educationList, setEducationList] = useState<EducationItem[]>(
    Array.isArray(initialProfile.education)
      ? (initialProfile.education as unknown as EducationItem[])
      : []
  );

  const handleAddEducation = () => {
    setEducationList([
      ...educationList,
      { institution: '', degree: '', field: '', year: '' },
    ]);
  };

  const handleRemoveEducation = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const handleEducationChange = (
    index: number,
    field: keyof EducationItem,
    value: string
  ) => {
    const updated = [...educationList];
    updated[index][field] = value;
    setEducationList(updated);
  };

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div className="p-4 rounded-xl text-xs bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-4 rounded-xl text-xs bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
          {state.message}
        </div>
      )}

      {/* Hidden input to pass serialized education data */}
      <input
        type="hidden"
        name="education"
        value={JSON.stringify(educationList)}
      />

      {/* Identitas Utama */}
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
          1. Identitas Utama
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Nama Lengkap &amp; Gelar <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={initialProfile.name}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
              Display Name (Nama Tampilan) <span className="text-red-500">*</span>
            </label>
            <input
              name="display_name"
              type="text"
              required
              defaultValue={initialProfile.display_name}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Jabatan / Headline Publik <span className="text-red-500">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            defaultValue={initialProfile.title}
            placeholder="Contoh: Tokoh Publik & Pengabdi Masyarakat"
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Biografi Lengkap
          </label>
          <textarea
            name="biography"
            rows={5}
            defaultValue={initialProfile.biography || ''}
            placeholder="Tuliskan biografi pengabdian dan perjalanan Rahmat Ichwan Bahtiar..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>
      </div>

      {/* Visi & Misi */}
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
          2. Visi &amp; Misi
        </h2>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Visi Kepemimpinan
          </label>
          <textarea
            name="vision"
            rows={3}
            defaultValue={initialProfile.vision || ''}
            placeholder="Visi utama yang diusung..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
            Misi &amp; Komitmen Pelayanan
          </label>
          <textarea
            name="mission"
            rows={3}
            defaultValue={initialProfile.mission || ''}
            placeholder="Poin-poin misi pengabdian..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>
      </div>

      {/* Riwayat Pendidikan */}
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
            3. Riwayat Pendidikan
          </h2>
          <button
            type="button"
            onClick={handleAddEducation}
            className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 rounded-lg transition-colors"
          >
            + Tambah Riwayat Pendidikan
          </button>
        </div>

        {educationList.length === 0 ? (
          <p className="text-xs text-neutral-500 italic py-2">
            Belum ada riwayat pendidikan yang ditambahkan.
          </p>
        ) : (
          <div className="space-y-3">
            {educationList.map((item, index) => (
              <div
                key={index}
                className="p-3.5 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end"
              >
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Institusi / Universitas
                  </label>
                  <input
                    type="text"
                    value={item.institution}
                    onChange={(e) =>
                      handleEducationChange(index, 'institution', e.target.value)
                    }
                    placeholder="Nama institusi"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                    Jenjang &amp; Jurusan
                  </label>
                  <input
                    type="text"
                    value={item.degree ? `${item.degree} - ${item.field}` : item.field}
                    onChange={(e) =>
                      handleEducationChange(index, 'field', e.target.value)
                    }
                    placeholder="S1 Ilmu Politik"
                    className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700"
                  />
                </div>

                <div className="flex gap-2 items-center">
                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-neutral-600 dark:text-neutral-400 mb-1">
                      Tahun
                    </label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) =>
                        handleEducationChange(index, 'year', e.target.value)
                      }
                      placeholder="2010"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-700"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(index)}
                    className="px-2 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 rounded self-end mb-0.5"
                    title="Hapus baris"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pengaturan Publikasi */}
      <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div>
          <span className="text-sm font-bold block">Status Publikasi Profil</span>
          <span className="text-xs text-neutral-500">
            Jika dinonaktifkan, halaman profil publik tidak akan menampilkan data ini.
          </span>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            name="is_published"
            type="checkbox"
            defaultChecked={initialProfile.is_published}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer dark:bg-neutral-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-50"
        >
          {isPending ? 'Menyimpan Perubahan...' : 'Simpan Profil'}
        </button>
      </div>
    </form>
  );
}
