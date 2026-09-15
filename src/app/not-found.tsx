import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-50 text-neutral-900">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-sm border border-neutral-200 text-center">
        <h1 className="text-4xl font-extrabold mb-2 text-neutral-900">404</h1>
        <h2 className="text-lg font-semibold mb-2">Halaman Tidak Ditemukan</h2>
        <p className="text-sm text-neutral-600 mb-6">
          Halaman yang Anda tuju tidak tersedia atau telah dipindahkan.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#191919] hover:bg-[#AF191A] rounded-md transition-colors shadow-xs"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
