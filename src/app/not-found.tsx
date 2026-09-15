import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-md w-full p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-800 text-center">
        <h1 className="text-4xl font-extrabold mb-2 text-neutral-900 dark:text-neutral-100">404</h1>
        <h2 className="text-lg font-semibold mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-md transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
