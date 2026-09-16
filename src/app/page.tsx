/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
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
    getPublishedArticles({ limit: 6 }),
    getPublishedAlbums(),
  ]);

  const featuredActivities = activities.filter((a) => a.featured);
  const displayActivities = featuredActivities.length > 0 ? featuredActivities : activities;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      {/* Public Header with Black Background & KAWAN RIB Branding */}
      <PublicHeader activeRoute="/" />

      {/* Main Content: Render Active Sections Dynamically in Order */}
      <main className="flex-1">
        {sections.map((sec) => {
          const content = (sec.content as Record<string, string | number | boolean | null | undefined>) || {};

          // 1. HERO SECTION (Atmospheric Layout with Cutout Portrait)
          if (sec.section_key === 'hero') {
            return (
              <section
                key={sec.id}
                className="relative overflow-hidden bg-neutral-950 border-b border-neutral-800 min-h-[580px] sm:min-h-[640px] md:min-h-[680px] lg:min-h-[720px] xl:min-h-[760px] flex items-end"
              >
                {/* Background Image with Light/Clear Atmospheric Overlay */}
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: "url('/hero-bg.webp')" }}
                >
                  {/* Gentle gradient overlay so background people/village photo is clearly visible */}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/55 via-black/20 to-black/35" />
                </div>

                {/* Foreground Container: Mobile order swapped (Text on top, photo on bottom) */}
                <div className="relative z-10 max-w-6xl w-full mx-auto px-6 flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 items-end">
                  {/* Text & CTA Column: order-1 on mobile, col-span-7 / order-2 on desktop */}
                  <div className="order-1 md:order-2 md:col-span-7 flex flex-col justify-center pt-10 md:pt-16 md:py-20 space-y-4 md:space-y-5 text-center md:text-left w-full">
                    <div>
                      <span className="inline-block px-3 py-1 text-[11px] sm:text-xs font-bold tracking-wider uppercase rounded-md bg-[#AF191A] text-white shadow-sm">
                        KANAL ASPIRASI
                      </span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-[#FFCC00] leading-tight drop-shadow-md">
                      {content.headline || 'Rahmat Ichwan Bahtiar, S.M'}
                    </h1>

                    <p className="text-sm sm:text-base text-white max-w-xl mx-auto md:mx-0 leading-relaxed font-medium drop-shadow-sm">
                      {content.subheadline ||
                        'Keterbukaan rekam kerja, publikasi gagasan, dan saluran aspirasi masyarakat Rahmat Ichwan Bahtiar.'}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-3.5 pt-2">
                      <Link
                        href={getString(content.cta_primary_link, '/tentang')}
                        className="px-5 py-3 text-xs sm:text-sm font-semibold rounded-xl bg-[#AF191A] text-white hover:bg-[#8e1415] transition-all shadow-md"
                      >
                        {content.cta_primary_label || 'Lihat Profil & Rekam Jejak'}
                      </Link>
                      <Link
                        href={getString(content.cta_secondary_link, '/aspirasi')}
                        className="px-5 py-3 text-xs sm:text-sm font-semibold rounded-xl bg-white text-[#191919] hover:bg-neutral-100 transition-all shadow-md"
                      >
                        {content.cta_secondary_label || 'Sampaikan Aspirasi Warga'}
                      </Link>
                    </div>
                  </div>

                  {/* Cutout Portrait Column: order-2 on mobile (at bottom), col-span-5 / order-1 on desktop */}
                  <div className="order-2 md:order-1 md:col-span-5 flex justify-center md:justify-start items-end w-full">
                    <img
                      src="/rahmat-ichwan-bahtiar-hero.png"
                      alt={profile?.name || 'Rahmat Ichwan Bahtiar, S.M'}
                      className="h-[300px] sm:h-[380px] md:h-[480px] lg:h-[540px] xl:h-[580px] w-auto object-contain object-bottom drop-shadow-2xl"
                    />
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
                className="py-16 px-6 border-b border-neutral-200 bg-white"
              >
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
                  <div className="md:col-span-1 text-center md:text-left">
                    <div className="w-36 h-36 mx-auto md:mx-0 rounded-2xl bg-neutral-900 border-2 border-[#AF191A] flex items-center justify-center text-4xl font-extrabold font-mono text-[#FFCC00] shadow-md">
                      RIB
                    </div>
                    <h2 className="text-xl font-bold mt-4 text-[#191919]">
                      {profile?.name || 'Rahmat Ichwan Bahtiar'}
                    </h2>
                    <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                      {profile?.title || 'Tokoh Publik & Pelayan Masyarakat'}
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="border-l-4 border-[#AF191A] pl-4">
                      <span className="text-xs uppercase font-bold tracking-wider text-[#AF191A]">
                        {content.title || 'Mengenal Rahmat Ichwan Bahtiar'}
                      </span>
                      <p className="text-sm font-medium text-neutral-800 mt-1 italic">
                        &ldquo;{profile?.vision || 'Mewujudkan kepemimpinan yang berintegritas dan melayani.'}&rdquo;
                      </p>
                    </div>

                    <p className="text-sm text-neutral-600 leading-relaxed">
                      {profile?.biography ||
                        'Mendedikasikan perjalanan kariernya untuk pengabdian publik dan transparansi kebijakan demi kemaslahatan masyarakat luas.'}
                    </p>

                    <div className="pt-2">
                      <Link
                        href="/tentang"
                        className="inline-flex items-center text-xs font-semibold text-[#AF191A] hover:underline"
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
                className="py-16 px-6 border-b border-neutral-200 bg-neutral-50"
              >
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
                        Rekam Jejak
                      </span>
                      <h2 className="text-2xl font-bold mt-1 text-[#191919]">
                        {content.title || 'Highlight Rekam Kerja'}
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">
                        {content.subtitle || 'Program advokasi dan kegiatan pengabdian kemasyarakatan.'}
                      </p>
                    </div>
                    <Link
                      href="/rekam-kerja"
                      className="text-xs font-semibold text-[#AF191A] hover:underline"
                    >
                      Lihat Semua Rekam Kerja &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {displayActivities.slice(0, getNumber(content.display_count, 3)).map((act) => (
                      <Link
                        key={act.id}
                        href={`/rekam-kerja/${act.slug}`}
                        className="group p-5 rounded-xl border border-neutral-200 bg-white shadow-xs flex flex-col justify-between space-y-4 hover:border-[#AF191A] transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="inline-block px-2 py-0.5 text-[10px] font-mono font-semibold rounded bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20">
                              {act.type}
                            </span>
                            {act.featured && (
                              <span className="inline-block px-2 py-0.5 text-[10px] font-bold rounded bg-[#FFCC00]/30 text-[#191919] border border-[#FFCC00]/60">
                                ★ Unggulan
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-[#191919] group-hover:text-[#AF191A] transition-colors line-clamp-2">
                            {act.title}
                          </h3>
                          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">{act.summary}</p>
                        </div>
                        <div className="pt-2 border-t border-neutral-100 text-[11px] text-neutral-500 flex justify-between">
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
                className="py-16 px-6 border-b border-neutral-200 bg-white"
              >
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                        Kabar &amp; Opini
                      </span>
                      <h2 className="text-2xl font-bold mt-1 text-[#191919]">
                        {content.title || 'Kabar & Gagasan Terbaru'}
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">
                        {content.subtitle || 'Pemikiran kebijakan, opini, dan catatan program.'}
                      </p>
                    </div>
                    <Link
                      href="/kabar"
                      className="text-xs font-semibold text-[#AF191A] hover:underline"
                    >
                      Lihat Semua Kabar &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {articles.slice(0, getNumber(content.display_count, 3)).map((art) => (
                      <Link
                        key={art.id}
                        href={`/kabar/${art.slug}`}
                        className="group p-5 rounded-xl border border-neutral-200 bg-white shadow-xs flex flex-col justify-between space-y-4 hover:border-[#AF191A] hover:shadow-sm transition-all"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                                art.type === 'BERITA'
                                  ? 'bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20'
                                  : 'bg-neutral-100 text-[#191919] border border-neutral-300'
                              }`}
                            >
                              {art.type}
                            </span>
                            {art.featured && (
                              <span className="text-[10px] font-bold text-[#FFCC00]">
                                ★ Unggulan
                              </span>
                            )}
                            {art.category && (
                              <span className="text-[10px] text-neutral-500">
                                • {art.category}
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-[#191919] group-hover:text-[#AF191A] transition-colors line-clamp-2 leading-snug">
                            {art.title}
                          </h3>
                          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
                            {art.excerpt}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-500">
                          <span>{art.author}</span>
                          <span className="font-semibold text-[#AF191A] group-hover:underline">
                            Baca Selengkapnya &rarr;
                          </span>
                        </div>
                      </Link>
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
                className="py-16 px-6 border-b border-neutral-200 bg-neutral-50"
              >
                <div className="max-w-6xl mx-auto space-y-8">
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
                        Dokumentasi
                      </span>
                      <h2 className="text-2xl font-bold mt-1 text-[#191919]">
                        {content.title || 'Dokumentasi Kegiatan'}
                      </h2>
                      <p className="text-xs text-neutral-500 mt-1">
                        {content.subtitle || 'Foto dan video interaksi pengabdian di tengah masyarakat.'}
                      </p>
                    </div>
                    <Link
                      href="/galeri"
                      className="text-xs font-semibold text-[#AF191A] hover:underline"
                    >
                      Buka Galeri &rarr;
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {albums.slice(0, getNumber(content.display_count, 3)).map((alb) => (
                      <div
                        key={alb.id}
                        className="rounded-xl border border-neutral-200 bg-white overflow-hidden shadow-xs hover:border-[#AF191A] transition-colors"
                      >
                        <div className="h-40 bg-neutral-100 flex items-center justify-center text-xs text-neutral-400">
                          {alb.cover_image_url ? 'Dokumentasi Visual' : 'Album Dokumentasi'}
                        </div>
                        <div className="p-4 space-y-1">
                          <h3 className="text-sm font-bold text-[#191919]">{alb.title}</h3>
                          <p className="text-xs text-neutral-500 line-clamp-1">{alb.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          }

          // 6. ASPIRASI CTA SECTION (Bright Light Theme)
          if (sec.section_key === 'aspirations_cta') {
            return (
              <section
                key={sec.id}
                className="py-20 px-6 bg-gradient-to-br from-neutral-50 via-amber-50/20 to-neutral-50 text-[#191919] border-t-4 border-[#AF191A] border-b border-neutral-200"
              >
                <div className="max-w-3xl mx-auto text-center space-y-6">
                  <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-[#AF191A]/10 text-[#AF191A]">
                    Partisipasi Warga
                  </span>
                  <h2 className="text-3xl font-extrabold tracking-tight text-[#191919]">
                    {content.title || 'Saluran Aspirasi Warga'}
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto leading-relaxed">
                    {content.subtitle ||
                      'Sampaikan masukan, keluhan, dan harapan untuk kemajuan daerah secara langsung melalui saluran resmi terverifikasi.'}
                  </p>
                  <div>
                    <Link
                      href="/aspirasi"
                      className="inline-flex px-6 py-3 text-sm font-bold rounded-xl bg-[#AF191A] text-white hover:bg-[#8e1415] transition-colors shadow-md"
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

      {/* Public Footer (Light Theme) */}
      <footer className="py-12 px-6 bg-white border-t border-neutral-200 text-xs text-neutral-600 text-center">
        <div className="max-w-6xl mx-auto space-y-2">
          <p className="font-bold text-[#191919] text-sm">
            {profile?.display_name || 'Rahmat Ichwan Bahtiar'}
          </p>
          <p className="text-[#AF191A] font-medium">Platform Resmi Informasi &amp; Akuntabilitas Publik</p>
          <p className="text-[11px] text-neutral-400 pt-4">
            &copy; {new Date().getFullYear()} Rahmat Ichwan Bahtiar. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
