'use client';

import { useEffect } from 'react';
import Link from 'next/link';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Unhandled application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-neutral-50 text-[#191919]">
      <div className="max-w-md w-full p-8 rounded-2xl bg-white border border-neutral-200 shadow-md text-center space-y-6">
        <div className="w-14 h-14 rounded-full bg-red-50 border-2 border-red-500 text-red-600 flex items-center justify-center mx-auto text-xl font-bold shadow-xs">
          !
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
            Kendala Teknis
          </span>
          <h1 className="text-xl font-bold text-[#191919]">
            Terjadi Kesalahan pada Halaman Ini
          </h1>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Sistem kami mengalami kendala sementara saat memuat data yang diminta. Silakan coba muat ulang halaman.
          </p>
        </div>

        {error.digest && (
          <div className="p-2.5 rounded-lg bg-neutral-100 text-[10px] font-mono text-neutral-500 truncate">
            Kode Kesalahan: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#AF191A] hover:bg-[#8e1415] text-white font-bold text-xs transition-colors shadow-xs"
          >
            Coba Lagi
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-neutral-300 bg-white hover:bg-neutral-100 text-neutral-700 font-bold text-xs transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
