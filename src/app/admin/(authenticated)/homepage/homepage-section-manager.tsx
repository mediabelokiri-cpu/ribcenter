'use client';

import { useState, useActionState } from 'react';
import type { HomepageSection } from '@/types/database';
import {
  updateSectionConfigAction,
  toggleSectionActiveAction,
  moveSectionAction,
  type SectionActionState,
} from './actions';

export function HomepageSectionManager({ initialSections }: { initialSections: HomepageSection[] }) {
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);

  const [state, formAction, isPending] = useActionState<SectionActionState, FormData>(
    async (prev, formData) => {
      const res = await updateSectionConfigAction(prev, formData);
      if (res.success) setEditingSection(null);
      return res;
    },
    {}
  );

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs text-[#191919]">
        <p className="font-semibold text-[#AF191A]">Prinsip: Fixed System, Flexible Content</p>
        <p className="mt-0.5 opacity-90 text-neutral-600">
          Admin mengatur urutan, status tayang, dan isi narasi setiap bagian beranda. Tata letak kode tetap stabil dan terstruktur tanpa risiko perusakan tampilan situs.
        </p>
      </div>

      {state?.error && (
        <div className="p-3 text-xs rounded bg-red-50 text-red-700 border border-red-200">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="p-3 text-xs rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
          {state.message}
        </div>
      )}

      {/* Edit Modal / Drawer */}
      {editingSection && (
        <div className="p-6 rounded-xl bg-white border-2 border-[#AF191A] shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#AF191A] font-bold">
                Key: {editingSection.section_key}
              </span>
              <h2 className="text-sm font-bold text-[#191919]">
                Konfigurasi Konten: {editingSection.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setEditingSection(null)}
              className="text-xs text-neutral-500 hover:text-neutral-800"
            >
              Tutup
            </button>
          </div>

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="id" value={editingSection.id} />

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Judul Seksi Admin *</label>
              <input
                name="title"
                type="text"
                required
                defaultValue={editingSection.title}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
              />
            </div>

            {/* Custom fields based on section_key */}
            <SectionConfigFields section={editingSection} />

            <div className="flex justify-between items-center pt-2">
              <label className="flex items-center gap-2 text-xs cursor-pointer text-neutral-700">
                <input
                  name="is_active"
                  type="checkbox"
                  defaultChecked={editingSection.is_active}
                  className="rounded"
                />
                <span>Aktifkan &amp; Tampilkan di Beranda</span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="px-3 py-1.5 text-xs rounded border border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-4 py-1.5 text-xs font-semibold rounded bg-[#AF191A] hover:bg-[#8e1415] text-white disabled:opacity-50 transition-colors shadow-xs"
                >
                  {isPending ? 'Menyimpan...' : 'Simpan Konfigurasi'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Daftar Section */}
      <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="divide-y divide-neutral-100">
          {initialSections.map((sec, index) => (
            <div
              key={sec.id}
              className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:bg-neutral-50/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-bold font-mono text-[#191919]">
                  {sec.order_index}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#191919]">
                      {sec.title}
                    </h3>
                    <span className="text-[10px] font-mono text-neutral-400">
                      #{sec.section_key}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        sec.is_active
                          ? 'bg-[#FFCC00]/20 text-[#191919]'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {sec.is_active ? 'AKTIF' : 'NONAKTIF'}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    {getSectionSummary(sec)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                {/* Reorder Buttons */}
                <form action={moveSectionAction}>
                  <input type="hidden" name="id" value={sec.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={index === 0}
                    className="px-2 py-1 text-xs rounded border border-neutral-300 hover:border-[#AF191A] bg-white text-neutral-700 disabled:opacity-30"
                    title="Geser Naik"
                  >
                    &uarr;
                  </button>
                </form>

                <form action={moveSectionAction}>
                  <input type="hidden" name="id" value={sec.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={index === initialSections.length - 1}
                    className="px-2 py-1 text-xs rounded border border-neutral-300 hover:border-[#AF191A] bg-white text-neutral-700 disabled:opacity-30"
                    title="Geser Turun"
                  >
                    &darr;
                  </button>
                </form>

                {/* Toggle Active */}
                <form action={toggleSectionActiveAction}>
                  <input type="hidden" name="id" value={sec.id} />
                  <input type="hidden" name="current_status" value={sec.is_active ? 'true' : 'false'} />
                  <button
                    type="submit"
                    className="px-2.5 py-1 text-[11px] rounded border border-neutral-300 hover:bg-neutral-100 bg-white text-neutral-700"
                  >
                    {sec.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                  </button>
                </form>

                {/* Edit Config */}
                <button
                  type="button"
                  onClick={() => setEditingSection(sec)}
                  className="px-3 py-1 text-[11px] font-semibold rounded bg-[#AF191A] text-white hover:bg-[#8e1415] transition-colors shadow-xs"
                >
                  Atur Konten
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function getSectionSummary(section: HomepageSection): string {
  const c = (section.content as Record<string, unknown>) || {};
  switch (section.section_key) {
    case 'hero':
      return `Headline: "${c.headline || 'Belum diatur'}"`;
    case 'profile_summary':
      return `Judul Seksi: "${c.title || 'Mengenal Rahmat Ichwan Bahtiar'}"`;
    case 'featured_activities':
      return `Jumlah Kegiatan Tampil: ${c.display_count || 3}`;
    case 'latest_articles':
      return `Jumlah Artikel Tampil: ${c.display_count || 3}`;
    case 'gallery_preview':
      return `Jumlah Foto/Media Tampil: ${c.display_count || 4}`;
    case 'aspirations_cta':
      return `CTA: "${c.cta_label || 'Kirim Aspirasi'}"`;
    default:
      return 'Konfigurasi standar';
  }
}

type SectionContentValue = string | number;
type SectionContentRecord = Record<string, SectionContentValue>;

function SectionConfigFields({ section }: { section: HomepageSection }) {
  const content = (section.content as SectionContentRecord) || {};
  const [formData, setFormData] = useState<SectionContentRecord>(content);

  const updateField = (key: string, value: SectionContentValue) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-3 pt-2 border-t border-neutral-200">
      {/* Hidden serialized JSON */}
      <input type="hidden" name="content" value={JSON.stringify(formData)} />

      {section.section_key === 'hero' && (
        <>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Headline Utama *</label>
            <input
              type="text"
              required
              value={formData.headline || ''}
              onChange={(e) => updateField('headline', e.target.value)}
              placeholder="Contoh: Platform Informasi & Akuntabilitas Publik"
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Subheadline / Kalimat Pendukung *</label>
            <textarea
              rows={2}
              required
              value={formData.subheadline || ''}
              onChange={(e) => updateField('subheadline', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Label Tombol Utama (CTA 1)</label>
              <input
                type="text"
                value={formData.cta_primary_label || ''}
                onChange={(e) => updateField('cta_primary_label', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Tautan Tombol Utama</label>
              <input
                type="text"
                value={formData.cta_primary_link || '/tentang'}
                onChange={(e) => updateField('cta_primary_link', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Label Tombol Kedua (CTA 2)</label>
              <input
                type="text"
                value={formData.cta_secondary_label || ''}
                onChange={(e) => updateField('cta_secondary_label', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1">Tautan Tombol Kedua</label>
              <input
                type="text"
                value={formData.cta_secondary_link || '/aspirasi'}
                onChange={(e) => updateField('cta_secondary_link', e.target.value)}
                className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
              />
            </div>
          </div>
        </>
      )}

      {section.section_key === 'profile_summary' && (
        <>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Judul Seksi *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Subjudul / Deskripsi Pendukung</label>
            <input
              type="text"
              value={formData.subtitle || ''}
              onChange={(e) => updateField('subtitle', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Label Tombol Tautan Profil</label>
            <input
              type="text"
              value={formData.cta_label || 'Pelajari Profil Lengkap'}
              onChange={(e) => updateField('cta_label', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
            />
          </div>
        </>
      )}

      {(section.section_key === 'featured_activities' ||
        section.section_key === 'latest_articles' ||
        section.section_key === 'gallery_preview') && (
        <>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Judul Tampilan Seksi *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Deskripsi Pendukung</label>
            <input
              type="text"
              value={formData.subtitle || ''}
              onChange={(e) => updateField('subtitle', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Maksimal Jumlah Item Ditampilkan</label>
            <input
              type="number"
              min={1}
              max={12}
              value={formData.display_count || 3}
              onChange={(e) => updateField('display_count', parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
            />
          </div>
        </>
      )}

      {section.section_key === 'aspirations_cta' && (
        <>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Judul Ajakan *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Deskripsi Ajakan</label>
            <textarea
              rows={2}
              value={formData.subtitle || ''}
              onChange={(e) => updateField('subtitle', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1">Label Tombol Aspirasi</label>
            <input
              type="text"
              value={formData.cta_label || 'Kirim Aspirasi Sekarang'}
              onChange={(e) => updateField('cta_label', e.target.value)}
              className="w-full px-3 py-2 text-xs rounded border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:border-[#AF191A]"
            />
          </div>
        </>
      )}
    </div>
  );
}
