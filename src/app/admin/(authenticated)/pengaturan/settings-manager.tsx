'use client';

import { useState, useTransition } from 'react';
import type { ContactSettings, SocialSettings, GeneralSettings } from '@/services/settings';
import {
  saveContactSettingsAction,
  saveSocialSettingsAction,
  saveGeneralSettingsAction,
} from './actions';

interface SettingsManagerProps {
  initialContact: ContactSettings;
  initialSocial: SocialSettings;
  initialGeneral: GeneralSettings;
}

type TabKey = 'contact' | 'social' | 'general';

export function SettingsManager({
  initialContact,
  initialSocial,
  initialGeneral,
}: SettingsManagerProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('contact');
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(
    null
  );

  const handleSaveContact = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await saveContactSettingsAction(formData);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Pengaturan kontak berhasil disimpan dan diperbarui di halaman publik.' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Gagal menyimpan pengaturan kontak.' });
      }
    });
  };

  const handleSaveSocial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await saveSocialSettingsAction(formData);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Tautan media sosial resmi berhasil disimpan.' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Gagal menyimpan media sosial.' });
      }
    });
  };

  const handleSaveGeneral = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFeedback(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await saveGeneralSettingsAction(formData);
      if (res.success) {
        setFeedback({ type: 'success', message: 'Identitas umum situs berhasil disimpan.' });
      } else {
        setFeedback({ type: 'error', message: res.error || 'Gagal menyimpan identitas situs.' });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 gap-2">
        <button
          type="button"
          onClick={() => {
            setActiveTab('contact');
            setFeedback(null);
          }}
          className={`px-4 py-2.5 font-bold text-xs transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'contact'
              ? 'border-[#AF191A] text-[#AF191A]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>Kontak &amp; Sekretariat</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('social');
            setFeedback(null);
          }}
          className={`px-4 py-2.5 font-bold text-xs transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'social'
              ? 'border-[#AF191A] text-[#AF191A]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>Media Sosial Resmi</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('general');
            setFeedback(null);
          }}
          className={`px-4 py-2.5 font-bold text-xs transition-colors border-b-2 -mb-px flex items-center gap-2 ${
            activeTab === 'general'
              ? 'border-[#AF191A] text-[#AF191A]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <span>Identitas &amp; Umum</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Tab 1: Kontak & Sekretariat Form */}
      {activeTab === 'contact' && (
        <form onSubmit={handleSaveContact} className="p-6 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold text-[#191919]">Pengaturan Kontak &amp; Sekretariat</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Informasi ini akan ditampilkan di halaman publik <strong>/kontak</strong> dan tautan langsung WhatsApp warga.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="contact-whatsapp" className="text-xs font-semibold text-neutral-700">
                Nomor WhatsApp Resmi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="contact-whatsapp"
                name="whatsapp"
                defaultValue={initialContact.whatsapp}
                placeholder="Contoh: 081155667788 atau 62811..."
                required
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
              />
              <span className="text-[10px] text-neutral-400 block">
                Format nomor lokal Indonesia akan otomatis dihubungkan ke wa.me
              </span>
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-email" className="text-xs font-semibold text-neutral-700">
                Alamat Surel (Email) Resmi <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="contact-email"
                name="email"
                defaultValue={initialContact.email}
                placeholder="kontak@kawanrib.id"
                required
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="contact-address" className="text-xs font-semibold text-neutral-700">
              Alamat Sekretariat / Posko Pelayanan
            </label>
            <textarea
              id="contact-address"
              name="address"
              rows={3}
              defaultValue={initialContact.address}
              placeholder="Contoh: Jl. Pahlawan No. 45, Kab. Polewali Mandar, Provinsi Sulawesi Barat 91311"
              className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="contact-office-hours" className="text-xs font-semibold text-neutral-700">
                Jam Layanan / Operasional
              </label>
              <input
                type="text"
                id="contact-office-hours"
                name="office_hours"
                defaultValue={initialContact.office_hours}
                placeholder="Senin – Jumat: 08.30 – 17.00 WITA"
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="contact-map-url" className="text-xs font-semibold text-neutral-700">
                Tautan / Embed Peta (Opsional)
              </label>
              <input
                type="text"
                id="contact-map-url"
                name="map_embed_url"
                defaultValue={initialContact.map_embed_url}
                placeholder="https://maps.google.com/..."
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-neutral-100">
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-xl bg-[#AF191A] hover:bg-[#8e1415] text-white font-bold text-xs transition-colors shadow-xs disabled:opacity-50"
            >
              {isPending ? 'Menyimpan...' : 'Simpan Pengaturan Kontak'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Media Sosial Form */}
      {activeTab === 'social' && (
        <form onSubmit={handleSaveSocial} className="p-6 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold text-[#191919]">Kanal Media Sosial Resmi</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tautan profil resmi untuk komunikasi publik di halaman /kontak dan bagian footer.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="social-instagram" className="text-xs font-semibold text-neutral-700">
                Instagram URL
              </label>
              <input
                type="url"
                id="social-instagram"
                name="instagram"
                defaultValue={initialSocial.instagram}
                placeholder="https://instagram.com/..."
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="social-facebook" className="text-xs font-semibold text-neutral-700">
                Facebook Page URL
              </label>
              <input
                type="url"
                id="social-facebook"
                name="facebook"
                defaultValue={initialSocial.facebook}
                placeholder="https://facebook.com/..."
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="social-tiktok" className="text-xs font-semibold text-neutral-700">
                TikTok URL
              </label>
              <input
                type="url"
                id="social-tiktok"
                name="tiktok"
                defaultValue={initialSocial.tiktok}
                placeholder="https://tiktok.com/@..."
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="social-youtube" className="text-xs font-semibold text-neutral-700">
                YouTube Channel URL
              </label>
              <input
                type="url"
                id="social-youtube"
                name="youtube"
                defaultValue={initialSocial.youtube}
                placeholder="https://youtube.com/@..."
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label htmlFor="social-twitter" className="text-xs font-semibold text-neutral-700">
                X / Twitter URL
              </label>
              <input
                type="url"
                id="social-twitter"
                name="twitter"
                defaultValue={initialSocial.twitter}
                placeholder="https://x.com/..."
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-neutral-100">
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-xl bg-[#AF191A] hover:bg-[#8e1415] text-white font-bold text-xs transition-colors shadow-xs disabled:opacity-50"
            >
              {isPending ? 'Menyimpan...' : 'Simpan Media Sosial'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Identitas & Umum Form */}
      {activeTab === 'general' && (
        <form onSubmit={handleSaveGeneral} className="p-6 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-5">
          <div className="border-b border-neutral-100 pb-3">
            <h2 className="text-sm font-bold text-[#191919]">Identitas &amp; Informasi Umum Situs</h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Nama situs dan deskripsi platform publik.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="general-site-name" className="text-xs font-semibold text-neutral-700">
                Nama Situs / Brand <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="general-site-name"
                name="site_name"
                defaultValue={initialGeneral.site_name}
                required
                placeholder="RIB CENTER"
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="general-site-tagline" className="text-xs font-semibold text-neutral-700">
                Tagline Situs
              </label>
              <input
                type="text"
                id="general-site-tagline"
                name="site_tagline"
                defaultValue={initialGeneral.site_tagline}
                placeholder="Platform Informasi & Akuntabilitas Publik Rahmat Ichwan Bahtiar"
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="general-description" className="text-xs font-semibold text-neutral-700">
                Deskripsi Singkat Platform
              </label>
              <textarea
                id="general-description"
                name="description"
                rows={3}
                defaultValue={initialGeneral.description}
                placeholder="Deskripsi ringkas platform untuk kebutuhan meta SEO dan keterbukaan publik..."
                className="w-full p-2.5 rounded-lg border border-neutral-300 text-xs focus:ring-1 focus:ring-[#AF191A] focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-3 border-t border-neutral-100">
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-xl bg-[#AF191A] hover:bg-[#8e1415] text-white font-bold text-xs transition-colors shadow-xs disabled:opacity-50"
            >
              {isPending ? 'Menyimpan...' : 'Simpan Identitas Umum'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
