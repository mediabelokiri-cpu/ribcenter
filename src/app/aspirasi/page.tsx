import { PublicHeader } from '@/components/layout/public-header';
import { AspirationForm } from './aspiration-form';

export const metadata = {
  title: 'Kanal Aspirasi Warga - KAWAN RIB (Rahmat Ichwan Bahtiar)',
  description:
    'Sampaikan aspirasi, pengaduan, atau usulan pembangunan wilayah secara langsung dan aman kepada Rahmat Ichwan Bahtiar.',
};

export default function AspirasiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-[#191919]">
      {/* Black Theme Unified Header */}
      <PublicHeader activeRoute="/aspirasi" />

      {/* Main Container */}
      <main className="flex-1 py-12 px-6">
        <div className="max-w-4xl mx-auto space-y-10">
          {/* Hero Intro */}
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20">
              Saluran Partisipasi Langsung
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#191919] tracking-tight">
              Kanal Aspirasi &amp; Aduan Warga
            </h1>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Ruang keterbukaan bagi masyarakat untuk menyampaikan usulan pembangunan, keluhan layanan publik, atau masukan kebijakan secara langsung kepada tim advokasi <strong>Rahmat Ichwan Bahtiar</strong>.
            </p>
          </div>

          {/* Three Commitment Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs text-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-[#AF191A]/10 text-[#AF191A] flex items-center justify-center mx-auto text-sm font-bold">
                1
              </div>
              <h2 className="text-xs font-bold text-neutral-900">Langsung ke Tim</h2>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Setiap aspirasi masuk langsung ke kotak kerja tim advokasi lapangan.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs text-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-[#AF191A]/10 text-[#AF191A] flex items-center justify-center mx-auto text-sm font-bold">
                2
              </div>
              <h2 className="text-xs font-bold text-neutral-900">Kerahasiaan Terjamin</h2>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Identitas dan nomor kontak warga dilindungi dan tidak ditampilkan publik.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-neutral-200 bg-white shadow-2xs text-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-[#AF191A]/10 text-[#AF191A] flex items-center justify-center mx-auto text-sm font-bold">
                3
              </div>
              <h2 className="text-xs font-bold text-neutral-900">Advokasi Nyata</h2>
              <p className="text-[11px] text-neutral-500 leading-normal">
                Diverifikasi untuk tindak lanjut kebijakan, reses, atau fasilitasi bantuan.
              </p>
            </div>
          </div>

          {/* Public Aspiration Form */}
          <AspirationForm />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 bg-white border-t border-neutral-200 text-xs text-neutral-600 text-center">
        <div className="max-w-6xl mx-auto space-y-2">
          <p className="font-bold text-[#191919] text-sm">
            KAWAN RIB — Rahmat Ichwan Bahtiar
          </p>
          <p className="text-[#AF191A] font-medium">Platform Resmi Informasi &amp; Akuntabilitas Publik</p>
          <p className="text-[11px] text-neutral-400 pt-4">
            &copy; {new Date().getFullYear()} Rahmat Ichwan Bahtiar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
