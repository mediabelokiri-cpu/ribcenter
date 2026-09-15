import Link from 'next/link';
import { isSupabaseConfigured } from '@/lib/env';

export default function HomePage() {
  const supabaseReady = isSupabaseConfigured();

  const publicRoutes = [
    { name: 'Tentang', path: '/tentang' },
    { name: 'Rekam Kerja', path: '/rekam-kerja' },
    { name: 'Kabar', path: '/kabar' },
    { name: 'Galeri', path: '/galeri' },
    { name: 'Aspirasi', path: '/aspirasi' },
    { name: 'Kontak', path: '/kontak' },
  ];

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center">
      <header className="border-b border-neutral-200 dark:border-neutral-800 pb-8 mb-8">
        <span className="inline-block px-2.5 py-1 text-xs font-semibold tracking-wide uppercase rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 mb-3">
          Phase 0 — Project Foundation
        </span>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Rahmat Ichwan Bahtiar
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2 text-base">
          Personal Public Information &amp; Accountability Platform
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
            Core Development Principles
          </h2>
          <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-300">
            <li className="flex items-start gap-2">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">•</span>
              <span><strong>Flexible Content, Fixed System:</strong> Developer controls the architecture; Admin manages content via CMS.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">•</span>
              <span><strong>Structured &amp; Database-Driven:</strong> No permanently hardcoded public content.</span>
            </li>
          </ul>
        </div>

        <div className="p-5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
          <h2 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
            System Foundation Status
          </h2>
          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between items-center py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-600 dark:text-neutral-400">Framework:</span>
              <span className="font-mono font-medium">Next.js 16 (App Router)</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-neutral-600 dark:text-neutral-400">TypeScript:</span>
              <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">Strict Mode</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-neutral-600 dark:text-neutral-400">Supabase SSR:</span>
              <span
                className={`font-mono text-xs font-semibold px-2 py-0.5 rounded ${
                  supabaseReady
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}
              >
                {supabaseReady ? 'Configured' : 'Client Ready (Needs .env credentials)'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-base font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
          Route Architecture Placeholders (Phase 0 Verification)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {publicRoutes.map((route) => (
            <Link
              key={route.path}
              href={route.path}
              className="p-3 text-sm rounded border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors block text-center font-medium"
            >
              {route.name}
              <span className="block text-xs font-mono text-neutral-400 dark:text-neutral-500 mt-1">
                {route.path}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Admin CMS Architecture Placeholder</h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Target area for Phase 1+ CMS operations (Feature-free placeholder)
          </p>
        </div>
        <Link
          href="/admin"
          className="px-3 py-1.5 text-xs font-medium bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 rounded hover:opacity-90 transition-opacity"
        >
          Inspect /admin
        </Link>
      </section>
    </main>
  );
}
