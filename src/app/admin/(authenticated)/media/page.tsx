export default function AdminMediaModulePage() {
  return (
    <div className="p-8 bg-white rounded-xl border border-neutral-200 text-center max-w-xl mx-auto mt-12 shadow-xs">
      <span className="inline-block px-2.5 py-1 text-xs font-semibold tracking-wide uppercase rounded bg-neutral-100 text-neutral-600 mb-3">
        Modul CMS
      </span>
      <h1 className="text-xl font-bold mb-2 text-[#191919]">Media &amp; Album Galeri</h1>
      <p className="text-xs text-neutral-500 mb-6">
        Modul ini akan diimplementasikan pada <strong>Phase 4 — Admin Articles &amp; Media</strong>.
      </p>
      <div className="p-3 bg-neutral-50 text-[11px] font-mono text-neutral-500 rounded border border-neutral-200">
        Fondasi Database: public.albums, public.media (Telah Siap)
      </div>
    </div>
  );
}
