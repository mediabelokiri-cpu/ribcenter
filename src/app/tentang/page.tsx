import Link from 'next/link';
import { getProfile, getTimeline, getOrganizations } from '@/services/profile';

export const dynamic = 'force-dynamic';

export default async function TentangPage() {
  const [profile, timeline, organizations] = await Promise.all([
    getProfile(),
    getTimeline(true),
    getOrganizations(true),
  ]);

  const education = Array.isArray(profile?.education)
    ? (profile.education as Array<{ institution: string; degree: string; field: string; year: string }>)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Public Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100">
            {profile?.display_name || 'Rahmat Ichwan Bahtiar'}
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Beranda
            </Link>
            <Link href="/tentang" className="text-neutral-900 dark:text-white font-semibold">
              Tentang
            </Link>
            <Link href="/rekam-kerja" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Rekam Kerja
            </Link>
            <Link href="/kabar" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Kabar
            </Link>
            <Link href="/galeri" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Galeri
            </Link>
            <Link href="/aspirasi" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Aspirasi
            </Link>
            <Link href="/kontak" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
              Kontak
            </Link>
            <Link
              href="/admin"
              className="ml-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity"
            >
              CMS Admin
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* 1. Profil & Biografi */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-36 h-36 rounded-2xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-4xl font-bold font-mono text-neutral-500 shadow-inner shrink-0">
              RIB
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Profil Tokoh Publik
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">
                {profile?.name || 'Rahmat Ichwan Bahtiar'}
              </h1>
              <p className="text-base font-semibold text-blue-700 dark:text-blue-400">
                {profile?.title || 'Tokoh Publik & Pelayan Masyarakat'}
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 pt-2 leading-relaxed">
                {profile?.biography}
              </p>
            </div>
          </div>

          {/* Visi & Misi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Visi Kepemimpinan
              </span>
              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200 leading-relaxed italic">
                &ldquo;{profile?.vision || 'Mewujudkan kepemimpinan yang transparan dan akuntabel.'}&rdquo;
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2 shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Misi &amp; Komitmen Pelayanan
              </span>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {profile?.mission}
              </p>
            </div>
          </div>

          {/* Riwayat Pendidikan */}
          {education.length > 0 && (
            <div className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                Latar Belakang Pendidikan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 space-y-1"
                  >
                    <span className="font-bold text-sm block">{edu.institution}</span>
                    <span className="text-xs text-neutral-600 dark:text-neutral-300 block">
                      {edu.degree} {edu.field ? `— ${edu.field}` : ''}
                    </span>
                    <span className="text-[11px] font-mono text-neutral-400 block">
                      Lulus Tahun {edu.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 2. Linimasa Perjalanan Politik */}
        <section className="space-y-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Jejak Langkah
            </span>
            <h2 className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">
              Perjalanan Politik &amp; Pengabdian
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tonggak rekam jejak, amanah legislatif, dan perjuangan kebijakan secara kronologis.
            </p>
          </div>

          {timeline.length === 0 ? (
            <p className="text-xs text-neutral-500 italic py-4">Belum ada linimasa yang dipublikasikan.</p>
          ) : (
            <div className="relative pl-6 border-l-2 border-neutral-200 dark:border-neutral-800 space-y-8">
              {timeline.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot */}
                  <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-neutral-900 dark:bg-neutral-100 border-4 border-neutral-50 dark:border-neutral-950"></span>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                        {item.year_start} {item.year_end ? `– ${item.year_end}` : '– Sekarang'}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 pt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. Rekam Jejak Organisasi */}
        <section className="space-y-6 pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
              Kepemimpinan
            </span>
            <h2 className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">
              Rekam Organisasi
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Riwayat kepengurusan, amanah kepemimpinan, dan kontribusi kelembagaan.
            </p>
          </div>

          {organizations.length === 0 ? (
            <p className="text-xs text-neutral-500 italic py-4">Belum ada riwayat organisasi yang dipublikasikan.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-neutral-500">
                      {org.period_start} {org.period_end ? `– ${org.period_end}` : ''}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                    {org.organization_name}
                  </h3>
                  <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {org.role}
                  </p>
                  {org.description && (
                    <p className="text-xs text-neutral-500 pt-1 leading-relaxed">
                      {org.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Public Footer */}
      <footer className="py-12 px-6 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 text-center">
        <div className="max-w-5xl mx-auto space-y-2">
          <p className="font-semibold text-neutral-700 dark:text-neutral-300">
            {profile?.display_name || 'Rahmat Ichwan Bahtiar'}
          </p>
          <p>Platform Resmi Informasi &amp; Akuntabilitas Publik</p>
          <p className="text-[11px] text-neutral-400 pt-4">
            &copy; {new Date().getFullYear()} Rahmat Ichwan Bahtiar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
