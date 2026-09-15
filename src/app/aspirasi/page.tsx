import Link from 'next/link';

export default function AspirasiPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center text-center">
      <div className="p-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <span className="inline-block px-2.5 py-1 text-xs font-semibold tracking-wide uppercase rounded bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 mb-3">
          Routing Foundation Placeholder
        </span>
        <h1 className="text-2xl font-bold mb-2">/aspirasi</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Architectural placeholder for Public Aspirations intake &amp; accountability.
          The submission mechanism and database processing will be established in future phases.
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-xs font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 underline"
        >
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
