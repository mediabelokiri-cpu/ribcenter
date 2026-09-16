import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import {
  getContactSettings,
  getSocialSettings,
  getGeneralSettings,
  formatWhatsAppUrl,
} from '@/services/settings';

export const metadata = {
  title: 'Kontak & Sekretariat Resmi - KAWAN RIB (Rahmat Ichwan Bahtiar)',
  description:
    'Saluran komunikasi resmi, alamat sekretariat relawan, WhatsApp layanan, dan informasi koordinasi publik Rahmat Ichwan Bahtiar.',
};

export default async function KontakPage() {
  const [contact, social, general] = await Promise.all([
    getContactSettings(),
    getSocialSettings(),
    getGeneralSettings(),
  ]);

  const waUrl = formatWhatsAppUrl(
    contact.whatsapp,
    'Halo Tim KAWAN RIB, saya ingin menghubungi sekretariat Rahmat Ichwan Bahtiar.'
  );

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-[#191919]">
      {/* Black Theme Unified Header */}
      <PublicHeader activeRoute="/kontak" />

      {/* Main Content */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-5xl mx-auto space-y-10">
          {/* Header Intro */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20">
              Saluran Komunikasi Resmi
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#191919] tracking-tight">
              Kontak &amp; Sekretariat
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Hubungi tim kami untuk keperluan audiensi, undangan kegiatan, koordinasi relawan, atau korespondensi resmi dengan <strong>{general.site_name}</strong>.
            </p>
          </div>

          {/* Primary Contact Channels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: WhatsApp Layanan Cepat */}
            <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-xs flex flex-col justify-between space-y-4 hover:border-[#25D366] transition-colors">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/10 text-[#25D366] flex items-center justify-center text-xl font-bold">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.45 1.036 1.08 1.597.697.621 1.286.814 1.469.901.183.087.29.072.398-.051.107-.123.462-.536.586-.724.124-.188.249-.157.419-.094.17.063 1.082.51 1.27.604.188.094.313.141.358.219.045.078.045.452-.099.857z"/>
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#191919]">Layanan WhatsApp</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Respon cepat untuk pesan koordinasi dan informasi umum.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="font-mono text-sm font-bold text-neutral-900 block">
                    {contact.whatsapp}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    {contact.office_hours || 'Senin – Jumat (Jam Kerja)'}
                  </span>
                </div>
              </div>

              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1ebd5a] text-white font-bold text-xs text-center transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>Chat WhatsApp &rarr;</span>
              </a>
            </div>

            {/* Card 2: Surel Resmi (Email) */}
            <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-xs flex flex-col justify-between space-y-4 hover:border-[#AF191A] transition-colors">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-[#AF191A]/10 text-[#AF191A] flex items-center justify-center text-xl font-bold">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#191919]">Surat Elektronik (Email)</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Untuk persuratan resmi, undangan kedinasan, dan kemitraan.
                  </p>
                </div>
                <div className="pt-2">
                  <span className="font-mono text-sm font-bold text-neutral-900 block truncate">
                    {contact.email}
                  </span>
                  <span className="text-[11px] text-neutral-400">
                    Korespondensi Terbuka
                  </span>
                </div>
              </div>

              <a
                href={`mailto:${contact.email}?subject=Permohonan%20Informasi%20/%20Undangan%20Resmi`}
                className="w-full py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-black text-white font-bold text-xs text-center transition-colors shadow-xs"
              >
                Kirim Email &rarr;
              </a>
            </div>

            {/* Card 3: Sekretariat & Posko */}
            <div className="p-6 rounded-2xl border border-neutral-200 bg-white shadow-xs flex flex-col justify-between space-y-4 hover:border-neutral-400 transition-colors">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-neutral-700 flex items-center justify-center text-xl font-bold">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#191919]">Sekretariat &amp; Posko</h2>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Pusat koordinasi relawan dan kantor pelayanan publik.
                  </p>
                </div>
                <div className="pt-2">
                  <p className="text-xs font-medium text-neutral-800 leading-relaxed">
                    {contact.address}
                  </p>
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    {contact.office_hours}
                  </span>
                </div>
              </div>

              {contact.map_embed_url ? (
                <a
                  href={contact.map_embed_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl border border-neutral-300 hover:bg-neutral-50 text-neutral-700 font-bold text-xs text-center transition-colors"
                >
                  Buka Peta Lokasi &rarr;
                </a>
              ) : (
                <div className="py-2.5 px-4 rounded-xl bg-neutral-50 text-neutral-400 font-medium text-xs text-center">
                  Sekretariat Wilayah
                </div>
              )}
            </div>
          </div>

          {/* Social Media Links Section */}
          <div className="p-8 rounded-2xl border border-neutral-200 bg-white shadow-xs space-y-4">
            <div className="text-center sm:text-left">
              <h2 className="text-lg font-bold text-[#191919]">Kanal Media Sosial Resmi</h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Ikuti publikasi pemikiran, liputan rekam kerja, dan video kegiatan terbaru di akun resmi kami.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 pt-2">
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-pink-300 text-center transition-all group"
                >
                  <span className="font-bold text-xs text-neutral-800 group-hover:text-pink-600 block">
                    Instagram
                  </span>
                  <span className="text-[10px] text-neutral-400 block truncate">
                    @{social.instagram.split('/').filter(Boolean).pop()}
                  </span>
                </a>
              )}

              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-blue-300 text-center transition-all group"
                >
                  <span className="font-bold text-xs text-neutral-800 group-hover:text-blue-600 block">
                    Facebook
                  </span>
                  <span className="text-[10px] text-neutral-400 block truncate">
                    Halaman Resmi
                  </span>
                </a>
              )}

              {social.tiktok && (
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-400 text-center transition-all group"
                >
                  <span className="font-bold text-xs text-neutral-800 group-hover:text-black block">
                    TikTok
                  </span>
                  <span className="text-[10px] text-neutral-400 block truncate">
                    Video Singkat
                  </span>
                </a>
              )}

              {social.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-red-300 text-center transition-all group"
                >
                  <span className="font-bold text-xs text-neutral-800 group-hover:text-red-600 block">
                    YouTube
                  </span>
                  <span className="text-[10px] text-neutral-400 block truncate">
                    Kanal Resmi
                  </span>
                </a>
              )}

              {social.twitter && (
                <a
                  href={social.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-neutral-400 text-center transition-all group"
                >
                  <span className="font-bold text-xs text-neutral-800 group-hover:text-neutral-900 block">
                    X (Twitter)
                  </span>
                  <span className="text-[10px] text-neutral-400 block truncate">
                    Gagasan Singkat
                  </span>
                </a>
              )}
            </div>
          </div>

          {/* Direct CTA to Aspirasi Channel Banner */}
          <div className="p-8 sm:p-10 rounded-2xl bg-gradient-to-r from-neutral-900 to-[#191919] text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border-t-4 border-[#FFCC00]">
            <div className="space-y-2 text-center sm:text-left">
              <span className="inline-block px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded bg-[#AF191A] text-[#FFCC00]">
                Saluran Aduan Warga
              </span>
              <h2 className="text-xl font-bold tracking-tight">
                Punya Masukan atau Aduan Permasalahan Daerah?
              </h2>
              <p className="text-xs text-neutral-400 max-w-xl">
                Untuk pengaduan warga yang terstruktur dengan nomor tiket pelacakan dan jaminan kerahasiaan identitas, gunakan formulir aspirasi online.
              </p>
            </div>

            <Link
              href="/aspirasi"
              className="px-6 py-3 rounded-xl bg-[#AF191A] hover:bg-[#8e1415] text-white font-bold text-xs whitespace-nowrap transition-colors shadow-xs"
            >
              Kirim Aspirasi Sekarang &rarr;
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-neutral-200 text-xs text-neutral-600 text-center">
        <div className="max-w-6xl mx-auto space-y-2">
          <p className="font-bold text-[#191919] text-sm">
            {general.site_name} — Rahmat Ichwan Bahtiar
          </p>
          <p className="text-[#AF191A] font-medium">{general.site_tagline}</p>
          <p className="text-[11px] text-neutral-400 pt-4">
            &copy; {new Date().getFullYear()} Rahmat Ichwan Bahtiar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
