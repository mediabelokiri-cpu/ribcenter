export default function AdminAspirasiModulePage() {
  return (
    <div className="p-8 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-center max-w-xl mx-auto mt-12">
      <span className="inline-block px-2.5 py-1 text-xs font-semibold tracking-wide uppercase rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 mb-3">
        Modul CMS
      </span>
      <h1 className="text-xl font-bold mb-2">Manajemen Aspirasi Warga</h1>
      <p className="text-xs text-neutral-500 mb-6">
        Modul ini akan diimplementasikan pada <strong>Phase 5 — Aspirations &amp; Settings</strong>.
      </p>
      <div className="p-3 bg-neutral-50 dark:bg-neutral-800 text-[11px] font-mono text-neutral-400 rounded">
        Fondasi Database: public.aspirations (Telah Siap, internal_note dilindungi)
      </div>
    </div>
  );
}
