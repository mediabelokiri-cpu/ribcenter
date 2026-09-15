import Link from 'next/link';
import { logoutAdmin } from '@/app/admin/actions';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminAuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const adminEmail = user?.email || 'admin@internal.local';

  return (
    <div className="min-h-screen flex bg-neutral-100 dark:bg-[#191919] text-[#191919] dark:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#191919] text-white border-r border-[#2A2A2A] flex flex-col">
        <div className="p-6 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#AF191A]"></span>
            <span className="text-[10px] font-bold tracking-widest text-[#FFCC00] uppercase">
              Admin CMS
            </span>
          </div>
          <h2 className="text-base font-bold text-white mt-0.5">
            Rahmat Ichwan B.
          </h2>
          <p className="text-xs text-neutral-400">
            Platform Akuntabilitas
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-4 overflow-y-auto text-xs">
          {/* Dashboard & Homepage */}
          <div>
            <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Utama
            </span>
            <div className="space-y-1">
              <Link
                href="/admin"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-300 hover:bg-[#252525] hover:text-[#FFCC00] transition-colors"
              >
                Dashboard Overview
              </Link>
              <Link
                href="/admin/homepage"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-300 hover:bg-[#252525] hover:text-[#FFCC00] transition-colors"
              >
                Homepage Manager
              </Link>
            </div>
          </div>

          {/* Profil Group */}
          <div>
            <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Profil &amp; Rekam Jejak
            </span>
            <div className="space-y-1">
              <Link
                href="/admin/profil"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-300 hover:bg-[#252525] hover:text-[#FFCC00] transition-colors"
              >
                Profil Utama
              </Link>
              <Link
                href="/admin/profil/perjalanan"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-300 hover:bg-[#252525] hover:text-[#FFCC00] transition-colors"
              >
                Perjalanan (Linimasa)
              </Link>
              <Link
                href="/admin/profil/organisasi"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-300 hover:bg-[#252525] hover:text-[#FFCC00] transition-colors"
              >
                Organisasi
              </Link>
            </div>
          </div>

          {/* Rekam Kerja Group */}
          <div>
            <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Rekam Kerja &amp; Program
            </span>
            <div className="space-y-1">
              <Link
                href="/admin/rekam-kerja"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-300 hover:bg-[#252525] hover:text-[#FFCC00] transition-colors"
              >
                Rekam Kerja
              </Link>
              <Link
                href="/admin/rekam-kerja/kategori"
                className="flex items-center px-3 py-2 font-medium rounded-lg text-neutral-300 hover:bg-[#252525] hover:text-[#FFCC00] transition-colors"
              >
                Kategori
              </Link>
            </div>
          </div>

          {/* Modul Mendatang (Phase 4+) */}
          <div>
            <span className="px-3 text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Modul Mendatang
            </span>
            <div className="space-y-1 opacity-50">
              <div className="px-3 py-1.5 text-neutral-400 cursor-not-allowed flex justify-between items-center">
                <span>Kabar &amp; Gagasan</span>
                <span className="text-[9px] bg-[#2A2A2A] px-1.5 py-0.5 rounded text-neutral-400">Fase 4</span>
              </div>
              <div className="px-3 py-1.5 text-neutral-400 cursor-not-allowed flex justify-between items-center">
                <span>Media &amp; Album</span>
                <span className="text-[9px] bg-[#2A2A2A] px-1.5 py-0.5 rounded text-neutral-400">Fase 4</span>
              </div>
              <div className="px-3 py-1.5 text-neutral-400 cursor-not-allowed flex justify-between items-center">
                <span>Aspirasi Warga</span>
                <span className="text-[9px] bg-[#2A2A2A] px-1.5 py-0.5 rounded text-neutral-400">Fase 5</span>
              </div>
              <div className="px-3 py-1.5 text-neutral-400 cursor-not-allowed flex justify-between items-center">
                <span>Pengaturan Situs</span>
                <span className="text-[9px] bg-[#2A2A2A] px-1.5 py-0.5 rounded text-neutral-400">Fase 5</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-[#2A2A2A] text-xs text-neutral-400">
          <span className="block font-semibold text-white">Fase 3: Rekam Kerja Engine</span>
          <span className="text-[11px] text-[#FFCC00]">Fixed System, Flexible Content</span>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-[#191919] border-b border-neutral-200 dark:border-[#2A2A2A] flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFCC00] ring-4 ring-[#FFCC00]/20 animate-pulse"></span>
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
              Admin Session Aktif
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-[#AF191A] dark:hover:text-[#FFCC00] border border-neutral-200 dark:border-[#333333] rounded-lg hover:border-[#AF191A] dark:hover:border-[#FFCC00] transition-colors"
            >
              Pratinjau Situs &rarr;
            </Link>

            <div className="text-right">
              <span className="text-xs font-semibold block text-neutral-800 dark:text-neutral-200">
                {adminEmail}
              </span>
              <span className="text-[10px] text-[#AF191A] dark:text-[#FFCC00] uppercase tracking-wider font-bold">
                Role: Administrator
              </span>
            </div>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-[#252525] hover:bg-[#AF191A] hover:text-white rounded-lg transition-colors"
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
