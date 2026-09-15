import Link from 'next/link';

export default function KontakPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 flex-1 flex flex-col justify-center text-center">
      <div className="p-8 rounded-xl border border-neutral-200 bg-white shadow-xs">
        <span className="inline-block px-2.5 py-1 text-xs font-semibold tracking-wide uppercase rounded bg-[#AF191A]/10 text-[#AF191A] mb-3">
          Routing Foundation Placeholder
        </span>
        <h1 className="text-2xl font-bold mb-2 text-[#191919]">/kontak</h1>
        <p className="text-sm text-neutral-600 mb-6">
          Architectural placeholder for Official Contact &amp; Communication Channels.
          Actual contact information will be managed through the CMS in future phases.
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
