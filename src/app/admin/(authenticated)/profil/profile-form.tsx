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

  const [photoUrl, setPhotoUrl] = useState(initialProfile.photo_url || '');
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const [educationList, setEducationList] = useState<EducationItem[]>(
    Array.isArray(initialProfile.education)
      ? (initialProfile.education as unknown as EducationItem[])
      : []
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const currentDisplayPhoto = filePreview || photoUrl;

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
    <form action={formAction} className="space-y-6" encType="multipart/form-data">
      {state?.error && (
        <div className="p-4 rounded-xl text-xs bg-red-50 text-red-800 border border-red-200 font-medium">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-4 rounded-xl text-xs bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
          {state.message}
        </div>
      )}

      {/* Hidden input to pass serialized education data */}
      <input
        type="hidden"
        name="education"
        value={JSON.stringify(educationList)}
      />

      {/* 1. Foto Profil Tokoh */}
      <div className="p-6 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
          1. Foto Profil Tokoh
        </h2>
        <p className="text-xs text-neutral-500">
          Foto ini akan menggantikan logo kotak inisial di Halaman Tentang dan Bagian Profil Beranda.
        </p>

        <div className="flex flex-col sm:flex-row items-start gap-6 pt-2">
          {/* Preview Box */}
          <div className="shrink-0 flex flex-col items-center">
            {currentDisplayPhoto ? (
              <div className="w-32 h-32 rounded-2xl overflow-hidden border-2 border-[#AF191A] shadow-md bg-neutral-100 relative group">
                <img
                  src={currentDisplayPhoto}
                  alt="Pratinjau Foto Profil"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            ) : (
              <div className="w-32 h-32 rounded-2xl bg-neutral-900 border-2 border-[#AF191A] flex items-center justify-center text-3xl font-extrabold font-mono text-[#FFCC00] shadow-md">
                RIB
              </div>
            )}
            <span className="text-[11px] text-neutral-400 mt-2">
              {currentDisplayPhoto ? 'Pratinjau Aktif' : 'Placeholder Inisial'}
            </span>
          </div>

          {/* Upload and URL Controls */}
          <div className="flex-1 space-y-4 w-full">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Unggah File Foto Langsung (JPG, PNG, WebP)
              </label>
              <input
                type="file"
                name="photo_file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="w-full text-xs text-neutral-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#AF191A]/10 file:text-[#AF191A] hover:file:bg-[#AF191A]/20 cursor-pointer border border-neutral-200 rounded-lg p-1.5"
              />
              <span className="text-[11px] text-neutral-400 block mt-1">
                Disarankan foto berorientasi potret atau persegi rasio 1:1, ukuran maks 5 MB.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Atau Masukkan Tautan / URL Gambar Online
              </label>
              <div className="flex gap-2">
                <input
                  name="photo_url"
                  type="url"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/foto-rahmat.jpg"
                  className="flex-1 px-3 py-2 text-xs rounded-lg border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
                />
                {photoUrl && (
                  <button
                    type="button"
                    onClick={() => setPhotoUrl('')}
                    className="px-3 py-2 text-xs font-semibold text-neutral-600 hover:text-[#AF191A] border border-neutral-300 rounded-lg hover:border-[#AF191A]"
                  >
                    Hapus URL
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Identitas Utama */}
      <div className="p-6 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
          2. Identitas Utama
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Nama Lengkap &amp; Gelar <span className="text-[#AF191A]">*</span>
            </label>
            <input
              name="name"
              type="text"
              required
              defaultValue={initialProfile.name}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">
              Display Name (Nama Tampilan) <span className="text-[#AF191A]">*</span>
            </label>
            <input
              name="display_name"
              type="text"
              required
              defaultValue={initialProfile.display_name}
              className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Jabatan / Headline Publik <span className="text-[#AF191A]">*</span>
          </label>
          <input
            name="title"
            type="text"
            required
            defaultValue={initialProfile.title}
            placeholder="Contoh: Tokoh Publik & Pengabdi Masyarakat"
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Biografi Lengkap
          </label>
          <textarea
            name="biography"
            rows={5}
            defaultValue={initialProfile.biography || ''}
            placeholder="Tuliskan biografi pengabdian dan perjalanan Rahmat Ichwan Bahtiar..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
          />
        </div>
      </div>

      {/* 3. Visi & Misi */}
      <div className="p-6 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
          3. Visi &amp; Misi
        </h2>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Visi Kepemimpinan
          </label>
          <textarea
            name="vision"
            rows={3}
            defaultValue={initialProfile.vision || ''}
            placeholder="Visi utama yang diusung..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1">
            Misi &amp; Komitmen Pelayanan
          </label>
          <textarea
            name="mission"
            rows={3}
            defaultValue={initialProfile.mission || ''}
            placeholder="Poin-poin misi pengabdian..."
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
          />
        </div>
      </div>

      {/* 4. Riwayat Pendidikan */}
      <div className="p-6 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
            4. Riwayat Pendidikan
          </h2>
          <button
            type="button"
            onClick={handleAddEducation}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#AF191A] hover:bg-[#8e1415] rounded-lg transition-colors"
          >
            + Tambah Riwayat
          </button>
        </div>

        {educationList.length === 0 ? (
          <p className="text-xs text-neutral-400 italic py-2">
            Belum ada data pendidikan yang ditambahkan.
          </p>
        ) : (
          <div className="space-y-3">
            {educationList.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                      Institusi / Universitas
                    </label>
                    <input
                      type="text"
                      value={item.institution}
                      onChange={(e) =>
                        handleEducationChange(index, 'institution', e.target.value)
                      }
                      placeholder="Universitas Mulawarman"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                      Jenjang / Gelar
                    </label>
                    <input
                      type="text"
                      value={item.degree}
                      onChange={(e) =>
                        handleEducationChange(index, 'degree', e.target.value)
                      }
                      placeholder="Magister (S2)"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
                    />
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-2">
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                      Program Studi / Jurusan
                    </label>
                    <input
                      type="text"
                      value={item.field}
                      onChange={(e) =>
                        handleEducationChange(index, 'field', e.target.value)
                      }
                      placeholder="Administrasi Publik"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[11px] font-medium text-neutral-600 mb-1">
                      Tahun
                    </label>
                    <input
                      type="text"
                      value={item.year}
                      onChange={(e) =>
                        handleEducationChange(index, 'year', e.target.value)
                      }
                      placeholder="2018 - 2020"
                      className="w-full px-2.5 py-1.5 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(index)}
                    className="px-2 py-1.5 text-xs font-semibold text-[#AF191A] hover:underline rounded self-end mb-0.5"
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

      {/* 5. Pengaturan Publikasi */}
      <div className="p-6 rounded-xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between">
        <div>
          <span className="text-sm font-bold block text-[#191919]">Status Publikasi Profil</span>
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
          <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#AF191A]"></div>
        </label>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 text-sm font-semibold text-white bg-[#AF191A] hover:bg-[#8e1415] rounded-lg transition-colors disabled:opacity-50 shadow-xs"
        >
          {isPending ? 'Menyimpan Perubahan...' : 'Simpan Profil'}
        </button>
      </div>
    </form>
  );
}
