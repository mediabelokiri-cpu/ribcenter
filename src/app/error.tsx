'use client';

import { useEffect } from 'react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error for development diagnostics
    console.error('Application Error Boundary Caught:', error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-md w-full p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xl">
          !
        </div>
        <h2 className="text-xl font-semibold mb-2">Terjadi Kesalahan</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Sistem mengalami kendala saat memproses permintaan.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-md transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    </main>
  );
}
