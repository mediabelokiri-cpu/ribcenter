import Link from 'next/link';

export default function AspirasiPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center text-center">
      <div className="p-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#191919]">
        <span className="inline-block px-2.5 py-1 text-xs font-semibold tracking-wide uppercase rounded bg-[#AF191A]/10 text-[#AF191A] dark:bg-[#AF191A]/20 dark:text-[#FFCC00] mb-3">
          Routing Foundation Placeholder
        </span>
        <h1 className="text-2xl font-bold mb-2 text-[#191919] dark:text-white">/aspirasi</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Architectural placeholder for Public Aspirations intake &amp; accountability.
          The submission mechanism and database processing will be established in future phases.
        </p>
        <Link
          href="/"
          className="inline-flex items-center text-xs font-medium text-[#AF191A] hover:underline"
        >
          &larr; Kembali ke Beranda
        </Link>
      </div>
    </main>
  );
}
