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

  const navigation = [
    { name: 'Dashboard', href: '/admin' },
    { name: 'Homepage', href: '/admin/homepage' },
    { name: 'Profil', href: '/admin/profil' },
    { name: 'Rekam Kerja', href: '/admin/rekam-kerja' },
    { name: 'Kabar', href: '/admin/kabar' },
    { name: 'Media', href: '/admin/media' },
    { name: 'Aspirasi', href: '/admin/aspirasi' },
    { name: 'Pengaturan', href: '/admin/pengaturan' },
  ];

  return (
    <div className="min-h-screen flex bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-xs font-semibold tracking-wider text-neutral-500 dark:text-neutral-400 uppercase">
            Admin CMS
          </span>
          <h2 className="text-base font-bold text-neutral-900 dark:text-neutral-100 mt-0.5">
            Rahmat Ichwan B.
          </h2>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Platform Akuntabilitas
          </p>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500">
          <span className="block font-semibold">Fase 1: CMS Foundation</span>
          <span className="text-[11px] text-neutral-400">Fixed System, Flexible Content</span>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
              Admin Session Aktif
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-xs font-semibold block text-neutral-800 dark:text-neutral-200">
                {adminEmail}
              </span>
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                Role: Administrator
              </span>
            </div>

            <form action={logoutAdmin}>
              <button
                type="submit"
                className="px-3 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/40 dark:hover:text-red-300 rounded-lg transition-colors"
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
