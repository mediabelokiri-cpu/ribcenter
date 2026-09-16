import Link from 'next/link';
import { logoutAdmin } from '@/app/admin/actions';
import { getCurrentUser, requireAdmin } from '@/lib/auth';
import { isSupabaseConfigured } from '@/lib/env';
import { AdminSidebarNav } from './admin-sidebar';

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
      <aside className="w-64 bg-[#AF191A] text-white border-r border-[#8B1415] flex flex-col shadow-md">
        <AdminSidebarNav />

        <div className="p-3.5 border-t border-white/10 bg-[#981516] text-xs text-white/80">
          <span className="block font-bold text-white tracking-wide">RIB CENTER</span>
          <span className="text-[11px] text-red-200 font-medium">Content Management System</span>
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
