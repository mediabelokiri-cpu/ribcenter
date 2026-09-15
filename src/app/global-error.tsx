'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global Layout Error Caught:', error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen flex items-center justify-center p-6 bg-neutral-100 text-neutral-900 font-sans">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-sm border border-neutral-300 text-center">
          <h2 className="text-xl font-bold mb-2">Kesalahan Kritis Sistem</h2>
          <p className="text-sm text-neutral-600 mb-6">
            Terjadi kendala pada struktur utama aplikasi.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 rounded-md hover:bg-neutral-800 transition-colors"
          >
            Muat Ulang Aplikasi
          </button>
        </div>
      </body>
    </html>
  );
}
