import Link from 'next/link';
import { getHomepageSections } from '@/services/homepage';
import { getProfile } from '@/services/profile';
import { getPublishedActivities } from '@/services/activities';
import { getPublishedArticles } from '@/services/articles';
import { getPublishedAlbums } from '@/services/media';

export const dynamic = 'force-dynamic';

function getString(val: unknown, fallback: string): string {
  return typeof val === 'string' && val.trim() ? val : fallback;
}

function getNumber(val: unknown, fallback: number): number {
  return typeof val === 'number' && !isNaN(val) ? val : fallback;
}

export default async function HomePage() {
  const [sections, profile, activities, articles, albums] = await Promise.all([
    getHomepageSections(true),
    getProfile(),
    getPublishedActivities({ limit: 6 }),
    getPublishedArticles({ limit: 3 }),
    getPublishedAlbums(),
  ]);

  const featuredActivities = activities.filter((a) => a.featured);
  const displayActivities = featuredActivities.length > 0 ? featuredActivities : activities;

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      {/* Public Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-base tracking-tight text-neutral-900 dark:text-neutral-100">
            {profile?.display_name || 'Rahmat Ichwan Bahtiar'}
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="text-neutral-900 dark:text-white font-semibold">
              Beranda
            </Link>
            <Link href="/tentang" className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors">
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

      {/* Main Content: Render Active Sections Dynamically in Order */}
      <main className="flex-1">
        {sections.map((sec) => {
          const content = (sec.content as Record<string, string | number | boolean | null | undefined>) || {};

          // 1. HERO SECTION
          if (sec.section_key === 'hero') {
            return (
              <section
                key={sec.id}
                className="py-20 md:py-28 px-6 bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950 border-b border-neutral-200 dark:border-neutral-800"
              >
                <div className="max-w-4xl mx-auto text-center space-y-6">
                  <span className="inline-block px-3 py-1 text-xs font-semibold tracking-wide uppercase rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Akuntabilitas &amp; Transparansi Publik
                  </span>
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
                    {content.headline || 'Platform Informasi & Akuntabilitas Publik'}
                  </h1>
                  <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-600 dark:text-neutral-400">
                    {content.subheadline ||
                      'Keterbukaan rekam kerja, publikasi gagasan, dan saluran aspirasi masyarakat Rahmat Ichwan Bahtiar.'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 pt-4">
                    {content.cta_primary_label && (
                      <Link
                        href={getString(content.cta_primary_link, '/tentang')}
                        className="px-6 py-3 text-sm font-semibold rounded-xl bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 hover:opacity-90 transition-opacity shadow-sm"
                      >
                        {content.cta_primary_label}
                      </Link>
                    )}
                    {content.cta_secondary_label && (
                      <Link
                        href={getString(content.cta_secondary_link, '/aspirasi')}
                        className="px-6 py-3 text-sm font-semibold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 transition-colors"
                      >
                        {content.cta_secondary_label}
                      </Link>
                    )}
                  </div>
                </div>
              </section>
            );
          }

          // 2. PROFIL SINGKAT SECTION (Direct from profile table)
          if (sec.section_key === 'profile_summary') {
            return (
              <section
                key={sec.id}
                className="py-16 px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
                  <div className="md:col-span-1 text-center md:text-left">
                    <div className="w-36 h-36 mx-auto md:mx-0 rounded-2xl bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-4xl font-bold font-mono text-neutral-500 shadow-inner">
                      RIB
                    </div>
                    <h2 className="text-xl font-bold mt-4 text-neutral-900 dark:text-neutral-100">
                      {profile?.name || 'Rahmat Ichwan Bahtiar'}
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {profile?.title || 'Tokoh Publik & Pelayan Masyarakat'}
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="border-l-2 border-neutral-900 dark:border-neutral-100 pl-4">
                      <span className="text-xs uppercase font-bold tracking-wider text-neutral-400">
                        {content.title || 'Mengenal Rahmat Ichwan Bahtiar'}
                      </span>
                      <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mt-1 italic">
                        &ldquo;{profile?.vision || 'Mewujudkan kepemimpinan yang berintegritas dan melayani.'}&rdquo;
                      </p>
                    </div>

                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {profile?.biography ||
                        'Mendedikasikan perjalanan kariernya untuk pengabdian publik dan transparansi kebijakan demi kemaslahatan masyarakat luas.'}
                    </p>

                    <div className="pt-2">
                      <Link
                        href="/tentang"
                        className="inline-flex items-center text-xs font-semibold text-neutral-900 dark:text-neutral-100 underline hover:opacity-80 transition-opacity"
                      >
                        {content.cta_label || 'Pelajari Profil & Rekam Jejak Selengkapnya'} &rarr;
                      </Link>
                    </div>
                  </div>
                </div>
              </section>
            );
          }

          // 3. HIGHLIGHT REKAM KERJA SECTION
          if (sec.section_key === 'featured_activities') {
            return (
              <section
                key={sec.id}
                className="py-16 px-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
              >
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Rekam Jejak
                      </span>
                      <h2 className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">
                        {content.title || 'Highlight Rekam Kerja'}
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">
                        {content.subtitle || 'Program advokasi dan kegiatan pengabdian kemasyarakatan.'}
                      </p>
                    </div>
                    <Link
                      href="/rekam-kerja"
                      className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:underline"
                    >
                      Lihat Semua Rekam Kerja &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayActivities.slice(0, getNumber(content.display_count, 3)).map((act) => (
                      <Link
                        key={act.id}
                        href={`/rekam-kerja/${act.slug}`}
                        className="group p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm flex flex-col justify-between space-y-4 hover:border-neutral-400 dark:hover:border-neutral-600 transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
                              {act.type}
                            </span>
                            {act.featured && (
                              <span className="inline-block px-1.5 py-0.5 text-[10px] font-semibold rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                                Unggulan
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {act.title}
                          </h3>
                          <p className="text-xs text-neutral-500 line-clamp-2">{act.summary}</p>
                        </div>
                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] text-neutral-400 flex justify-between">
                          <span>{act.date}</span>
                          <span>{act.regency || act.location || 'Wilayah'}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 4. KABAR TERBARU SECTION
          if (sec.section_key === 'latest_articles') {
            return (
              <section
                key={sec.id}
                className="py-16 px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900"
              >
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Kabar &amp; Opini
                      </span>
                      <h2 className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">
                        {content.title || 'Kabar & Gagasan Terbaru'}
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">
                        {content.subtitle || 'Pemikiran kebijakan, opini, dan catatan program.'}
                      </p>
                    </div>
                    <Link
                      href="/kabar"
                      className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:underline"
                    >
                      Lihat Semua Kabar &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {articles.slice(0, getNumber(content.display_count, 3)).map((art) => (
                      <div
                        key={art.id}
                        className="p-5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/40 shadow-sm flex flex-col justify-between space-y-4"
                      >
                        <div className="space-y-2">
                          <span className="inline-block px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300">
                            {art.type}
                          </span>
                          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                            {art.title}
                          </h3>
                          <p className="text-xs text-neutral-500 line-clamp-2">{art.excerpt}</p>
                        </div>
                        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-700 text-[11px] text-neutral-400">
                          Penulis: {art.author}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 5. GALERI PILIHAN SECTION
          if (sec.section_key === 'gallery_preview') {
            return (
              <section
                key={sec.id}
                className="py-16 px-6 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950"
              >
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Dokumentasi
                      </span>
                      <h2 className="text-2xl font-bold mt-1 text-neutral-900 dark:text-neutral-100">
                        {content.title || 'Dokumentasi Kegiatan'}
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">
                        {content.subtitle || 'Foto dan video interaksi pengabdian di tengah masyarakat.'}
                      </p>
                    </div>
                    <Link
                      href="/galeri"
                      className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:underline"
                    >
                      Buka Galeri &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {albums.slice(0, getNumber(content.display_count, 3)).map((alb) => (
                      <div
                        key={alb.id}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 overflow-hidden shadow-sm"
                      >
                        <div className="h-40 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs text-neutral-400">
                          {alb.cover_image_url ? 'Dokumentasi Visual' : 'Album Dokumentasi'}
                        </div>
                        <div className="p-4 space-y-1">
                          <h3 className="text-sm font-bold">{alb.title}</h3>
                          <p className="text-xs text-neutral-500 line-clamp-1">{alb.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 6. ASPIRASI CTA SECTION
          if (sec.section_key === 'aspirations_cta') {
            return (
              <section
                key={sec.id}
                className="py-20 px-6 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
              >
                <div className="max-w-3xl mx-auto text-center space-y-6">
                  <h2 className="text-3xl font-extrabold tracking-tight">
                    {content.title || 'Saluran Aspirasi Warga'}
                  </h2>
                  <p className="text-sm sm:text-base opacity-80 max-w-xl mx-auto">
                    {content.subtitle ||
                      'Sampaikan masukan, keluhan, dan harapan untuk kemajuan daerah secara langsung melalui saluran resmi terverifikasi.'}
                  </p>
                  <div>
                    <Link
                      href="/aspirasi"
                      className="inline-flex px-6 py-3 text-sm font-semibold rounded-xl bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white hover:opacity-90 transition-opacity shadow"
                    >
                      {content.cta_label || 'Kirim Aspirasi Sekarang'}
                    </Link>
                  </div>
                </div>
              </section>
            );
          }

          return null;
        })}
      </main>

      {/* Public Footer */}
      <footer className="py-12 px-6 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 text-xs text-neutral-500 text-center">
        <div className="max-w-6xl mx-auto space-y-2">
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
