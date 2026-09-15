import { getDashboardStats } from '@/services/dashboard';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-xl bg-white dark:bg-[#191919] border border-neutral-200 dark:border-neutral-800">
        <span className="inline-block px-2.5 py-1 text-xs font-semibold tracking-wide uppercase rounded bg-[#AF191A]/10 text-[#AF191A] dark:bg-[#AF191A]/20 dark:text-[#FFCC00] mb-2">
          CMS &amp; Platform Foundation
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-[#191919] dark:text-white">Dashboard Ringkasan</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
          Fondasi CMS dan metrik agregasi basis data platform Rahmat Ichwan Bahtiar.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-[#191919] border border-neutral-200 dark:border-neutral-800">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Rekam Kerja / Kegiatan
          </span>
          <div className="text-3xl font-extrabold mt-2 text-[#191919] dark:text-white">
            {stats.counts.totalActivities}
          </div>
          <span className="text-xs text-neutral-400 mt-1 block">
            Program, Reses &amp; Kegiatan
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#191919] border border-neutral-200 dark:border-neutral-800">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Kabar &amp; Gagasan
          </span>
          <div className="text-3xl font-extrabold mt-2 text-[#191919] dark:text-white">
            {stats.counts.totalArticles}
          </div>
          <span className="text-xs text-neutral-400 mt-1 block">
            Artikel Berita &amp; Opini
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#191919] border border-neutral-200 dark:border-neutral-800">
          <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
            Galeri &amp; Dokumentasi
          </span>
          <div className="text-3xl font-extrabold mt-2 text-[#191919] dark:text-white">
            {stats.counts.totalAlbums}
          </div>
          <span className="text-xs text-neutral-400 mt-1 block">
            Album Media Terdaftar
          </span>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-[#191919] border border-neutral-200 dark:border-neutral-800">
          <div className="flex justify-between items-start">
            <span className="text-xs font-medium text-neutral-500 uppercase tracking-wider">
              Aspirasi Warga
            </span>
            {stats.counts.pendingAspirations > 0 && (
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#FFCC00]/20 text-[#191919] dark:text-[#FFCC00]">
                {stats.counts.pendingAspirations} BARU
              </span>
            )}
          </div>
          <div className="text-3xl font-extrabold mt-2 text-[#191919] dark:text-white">
            {stats.counts.totalAspirations}
          </div>
          <span className="text-xs text-neutral-400 mt-1 block">
            Total Masukan Masyarakat
          </span>
        </div>
      </div>

      {/* Two Column Section: Latest Aspirations & Latest Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Aspirations */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#191919] border border-neutral-200 dark:border-neutral-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-[#191919] dark:text-white">Aspirasi Masuk Terbaru</h2>
            <Link
              href="/admin/aspirasi"
              className="text-xs font-medium text-[#AF191A] hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="space-y-3">
            {stats.latestAspirations.length === 0 ? (
              <p className="text-xs text-neutral-500">Belum ada aspirasi masuk.</p>
            ) : (
              stats.latestAspirations.map((asp) => (
                <div
                  key={asp.id}
                  className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {asp.subject}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-semibold rounded ${
                        asp.status === 'BARU'
                          ? 'bg-[#FFCC00]/20 text-[#191919] dark:text-[#FFCC00]'
                          : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      {asp.status}
                    </span>
                  </div>
                  <p className="text-neutral-500 mt-1 line-clamp-1">{asp.message}</p>
                  <div className="mt-2 text-[11px] text-neutral-400 flex gap-3">
                    <span>Pengirim: {asp.name}</span>
                    <span>Wilayah: {asp.regency || '-'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Latest Activities */}
        <div className="p-6 rounded-xl bg-white dark:bg-[#191919] border border-neutral-200 dark:border-neutral-800">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold text-[#191919] dark:text-white">Rekam Kerja Terbaru</h2>
            <Link
              href="/admin/rekam-kerja"
              className="text-xs font-medium text-[#AF191A] hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <div className="space-y-3">
            {stats.latestActivities.length === 0 ? (
              <p className="text-xs text-neutral-500">Belum ada rekam kerja tercatat.</p>
            ) : (
              stats.latestActivities.map((act) => (
                <div
                  key={act.id}
                  className="p-3 rounded-lg border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 text-xs"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                      {act.title}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200">
                      {act.type}
                    </span>
                  </div>
                  <p className="text-neutral-500 mt-1 line-clamp-1">{act.summary}</p>
                  <div className="mt-2 text-[11px] text-neutral-400 flex gap-3">
                    <span>Tanggal: {act.date}</span>
                    <span>Status: {act.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
