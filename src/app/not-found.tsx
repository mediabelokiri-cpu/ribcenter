import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';

export const metadata = {
  title: '404 - Halaman Tidak Ditemukan | KAWAN RIB',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      <PublicHeader />

      <main className="flex-1 flex items-center justify-center p-6 my-12">
        <div className="max-w-xl w-full text-center space-y-6">
          <div className="space-y-2">
            <span className="text-6xl sm:text-7xl font-mono font-black text-[#AF191A] tracking-tighter block">
              404
            </span>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600">
              Halaman Tidak Ditemukan
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191919] tracking-tight">
              Tautan yang Anda Tuju Tidak Tersedia
            </h1>
            <p className="text-xs sm:text-sm text-neutral-600 max-w-md mx-auto leading-relaxed">
              Halaman yang Anda cari mungkin telah dipindahkan, berstatus draf yang belum dipublikasikan, atau URL yang dimasukkan kurang tepat.
            </p>
          </div>

          {/* Quick Nav Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left">
            <Link
              href="/"
              className="p-4 rounded-xl border border-neutral-200 hover:border-[#AF191A] hover:bg-neutral-50 transition-all group"
            >
              <span className="text-xs font-bold text-[#191919] group-hover:text-[#AF191A] transition-colors block">
                &larr; Beranda Utama
              </span>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">
                Kembali ke halaman depan platform
              </span>
            </Link>

            <Link
              href="/rekam-kerja"
              className="p-4 rounded-xl border border-neutral-200 hover:border-[#AF191A] hover:bg-neutral-50 transition-all group"
            >
              <span className="text-xs font-bold text-[#191919] group-hover:text-[#AF191A] transition-colors block">
                Rekam Kerja &rarr;
              </span>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">
                Jelajahi rekam jejak dan program
              </span>
            </Link>

            <Link
              href="/kabar"
              className="p-4 rounded-xl border border-neutral-200 hover:border-[#AF191A] hover:bg-neutral-50 transition-all group"
            >
              <span className="text-xs font-bold text-[#191919] group-hover:text-[#AF191A] transition-colors block">
                Kabar &amp; Gagasan &rarr;
              </span>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">
                Baca artikel berita dan opini publik
              </span>
            </Link>

            <Link
              href="/aspirasi"
              className="p-4 rounded-xl border border-neutral-200 hover:border-[#AF191A] hover:bg-neutral-50 transition-all group"
            >
              <span className="text-xs font-bold text-[#AF191A] block">
                Kanal Aspirasi Warga &rarr;
              </span>
              <span className="text-[11px] text-neutral-500 mt-0.5 block">
                Sampaikan aduan atau aspirasi Anda
              </span>
            </Link>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
