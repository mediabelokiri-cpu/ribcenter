import Link from 'next/link';
import { logoutAdmin } from '@/app/admin/actions';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/env';

export const dynamic = 'force-dynamic';

export default async function AdminAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let adminEmail = 'admin@internal.local';

  if (isSupabaseConfigured()) {
    const session = await requireAdmin();
    adminEmail = session.user.email;
  } else {
    const user = await getCurrentUser();
    if (user?.email) {
      adminEmail = user.email;
    }
  }

  return (
    <div className="min-h-screen flex bg-[#F9FAFB] text-[#191919]">
      {/* Sidebar */}
      <aside className="w-64 bg-white text-[#191919] border-r border-neutral-200 flex flex-col shadow-xs">
        <div className="p-6 border-b border-neutral-200 bg-white">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#AF191A]"></span>
            <span className="text-[10px] font-bold tracking-widest text-[#AF191A] uppercase">
              Admin CMS
            </span>
          </div>
          <h2 className="text-base font-bold text-[#191919] mt-0.5">
            Rahmat Ichwan B.
          </h2>
          <p className="text-xs text-neutral-500">
            Platform Akuntabilitas
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-4 overflow-y-auto text-xs">
          {/* Dashboard & Homepage */}
          <div>
            <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Utama
            </span>
            <div className="space-y-1">
              <Link
                href="/admin"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Dashboard Overview
              </Link>
              <Link
                href="/admin/homepage"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Homepage Manager
              </Link>
            </div>
          </div>

          {/* Profil Group */}
          <div>
            <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Profil &amp; Rekam Jejak
            </span>
            <div className="space-y-1">
              <Link
                href="/admin/profil"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Profil Utama
              </Link>
              <Link
                href="/admin/profil/perjalanan"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Perjalanan (Linimasa)
              </Link>
              <Link
                href="/admin/profil/organisasi"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Organisasi
              </Link>
            </div>
          </div>

          {/* Rekam Kerja Group */}
          <div>
            <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Rekam Kerja &amp; Program
            </span>
            <div className="space-y-1">
              <Link
                href="/admin/rekam-kerja"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Rekam Kerja
              </Link>
              <Link
                href="/admin/rekam-kerja/kategori"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Kategori
              </Link>
            </div>
          </div>

          {/* Kabar & Publikasi Group (Phase 4) */}
          <div>
            <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Kabar &amp; Publikasi
            </span>
            <div className="space-y-1">
              <Link
                href="/admin/kabar/berita"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Berita
              </Link>
              <Link
                href="/admin/kabar/gagasan"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Gagasan
              </Link>
              <Link
                href="/admin/kabar"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Semua Artikel
              </Link>
            </div>
          </div>

          {/* Media & Galeri Group (Phase 5) */}
          <div>
            <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Media &amp; Galeri
            </span>
            <div className="space-y-1">
              <Link
                href="/admin/media"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Pustaka Media
              </Link>
              <Link
                href="/admin/media/album"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Album Galeri
              </Link>
              <Link
                href="/admin/media/video"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Video Eksternal
              </Link>
            </div>
          </div>

          {/* Partisipasi & Pengaturan (Phase 6) */}
          <div>
            <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1.5">
              Partisipasi &amp; Pengaturan
            </span>
            <div className="space-y-1">
              <Link
                href="/admin/aspirasi"
                className="flex items-center justify-between px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                <span>Aspirasi Warga</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#AF191A]/10 text-[#AF191A]">
                  Inbox
                </span>
              </Link>
              <Link
                href="/admin/pengaturan"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-700 hover:bg-neutral-100 hover:text-[#AF191A] transition-colors"
              >
                Pengaturan Situs
              </Link>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-neutral-200 bg-neutral-50/70 text-xs text-neutral-500">
          <span className="block font-semibold text-[#191919]">Fase 6: Aspirasi &amp; Kontak</span>
          <span className="text-[11px] text-[#AF191A] font-medium">Public Participation &amp; Settings</span>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFCC00] ring-4 ring-[#FFCC00]/30 animate-pulse"></span>
            <span className="text-xs font-medium text-neutral-700">
              Admin Session Aktif
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-[#AF191A] border border-neutral-300 rounded-lg hover:border-[#AF191A] transition-colors"
            >
              Pratinjau Situs &rarr;
            </Link>

            <div className="text-right">
              <span className="text-xs font-semibold block text-[#191919]">
                {adminEmail}
              </span>
              <span className="text-[10px] text-[#AF191A] uppercase tracking-wider font-bold">
                Role: Administrator
              </span>
            </div>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-[#AF191A] hover:text-white rounded-lg transition-colors"
              >
                Keluar
              </button>
            </form>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
