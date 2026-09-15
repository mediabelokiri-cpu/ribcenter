import Link from 'next/link';

export default function AdminPlaceholderPage() {
  return (
    <main className="max-w-2xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center text-center">
      <div className="p-8 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <span className="inline-block px-2.5 py-1 text-xs font-semibold tracking-wide uppercase rounded bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 mb-3">
          Admin CMS Area Placeholder
        </span>
        <h1 className="text-2xl font-bold mb-2">/admin</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
          Architectural placeholder reserved for the lightweight Admin CMS.
          Authentication, dashboard, and content management interfaces will be implemented in Phase 1 and later.
        </p>
        <div className="p-4 rounded bg-neutral-50 dark:bg-neutral-800/50 text-xs text-neutral-500 font-mono mb-6 text-left">
          Status: Foundation route active.<br />
          Authentication &amp; CMS modules: Reserved for future phases.
        </div>
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
