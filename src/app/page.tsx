/* eslint-disable @next/next/no-img-element */
import Link from 'next/link';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
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
  const otherActivities = activities.filter((a) => !a.featured);
  const displayActivities = [...featuredActivities, ...otherActivities];

  const featuredArticles = articles.filter((a) => a.featured);
  const otherArticles = articles.filter((a) => !a.featured);
  const displayArticles = [...featuredArticles, ...otherArticles];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      {/* Public Header with White Background & RIB CENTER Branding */}
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
                className="relative overflow-hidden bg-neutral-950 border-b border-neutral-800 min-h-[460px] sm:min-h-[500px] md:min-h-[540px] lg:min-h-[580px] xl:min-h-[620px] flex items-end"
              >
                {/* Background Image with Top-anchored alignment for wide panorama without cropping top content */}
                <div
                  className="absolute inset-0 bg-cover bg-top bg-no-repeat"
                  style={{ backgroundImage: "url('/hero-bg.webp')" }}
                >
                  {/* Gentle gradient overlay so background people/village photo is clearly visible */}
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/55 via-black/20 to-black/35" />
                </div>

                {/* Foreground Container: Mobile order swapped (Text on top, photo on bottom) */}
                <div className="relative z-10 max-w-7xl w-full mx-auto px-6 flex flex-col md:grid md:grid-cols-12 gap-6 md:gap-8 items-end">
                  {/* Text & CTA Column: order-1 on mobile, col-span-7 / order-2 on desktop */}
                  <div className="order-1 md:order-2 md:col-span-7 flex flex-col justify-center pt-8 md:pt-10 md:py-12 lg:py-14 space-y-3.5 md:space-y-4 text-center md:text-left w-full">
                    <div>
                      <span className="inline-block px-3 py-1 text-[11px] sm:text-xs font-bold tracking-wider uppercase rounded-md bg-[#AF191A] text-white shadow-sm">
                        PLATFORM INFORMASI & PUBLIKASI
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
                      className="h-[320px] sm:h-[400px] md:h-[480px] lg:h-[540px] xl:h-[600px] 2xl:h-[620px] w-auto max-w-full object-contain object-bottom drop-shadow-2xl"
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
                className="py-16 px-6 bg-[#AF191A] text-white relative overflow-hidden"
              >
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 items-center relative z-10">
                  <div className="md:col-span-1 text-center md:text-left">
                    {profile?.photo_url ? (
                      <div className="w-36 h-36 mx-auto md:mx-0 rounded-2xl overflow-hidden border-2 border-white/40 shadow-xl bg-white/10 ring-4 ring-white/20">
                        <img
                          src={profile.photo_url}
                          alt={profile.name || 'Rahmat Ichwan Bahtiar'}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div className="w-36 h-36 mx-auto md:mx-0 rounded-2xl bg-neutral-900 border-2 border-[#FFCC00] flex items-center justify-center text-4xl font-extrabold font-mono text-[#FFCC00] shadow-md">
                        RIB
                      </div>
                    )}
                    <h2 className="text-xl font-bold mt-4 text-white">
                      {profile?.name || 'Rahmat Ichwan Bahtiar'}
                    </h2>
                    <p className="text-xs text-red-100/90 mt-1 font-medium leading-snug">
                      {profile?.title || 'Tokoh Publik & Pelayan Masyarakat'}
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    <div className="border-l-4 border-[#FFCC00] pl-4">
                      <span className="text-xs uppercase font-extrabold tracking-wider text-[#FFCC00] block">
                        {content.title || 'Mengenal Rahmat Ichwan Bahtiar'}
                      </span>
                      <p className="text-sm sm:text-base font-semibold text-white mt-1 italic leading-relaxed">
                        &ldquo;{profile?.vision || 'Mewujudkan kepemimpinan yang berintegritas dan melayani.'}&rdquo;
                      </p>
                    </div>

                    <p className="text-sm text-white/90 leading-relaxed">
                      {profile?.biography ||
                        'Mendedikasikan perjalanan kariernya untuk pengabdian publik dan transparansi kebijakan demi kemaslahatan masyarakat luas.'}
                    </p>

                    <div className="pt-2">
                      <Link
                        href="/tentang"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold bg-white text-[#AF191A] hover:bg-neutral-100 shadow-sm transition-all group"
                      >
                        <span>{content.cta_label || 'Pelajari Profil & Rekam Jejak Selengkapnya'}</span>
                        <span className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
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
                className="py-16 sm:py-20 px-6 border-b border-neutral-200 bg-white"
              >
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
                  {/* Left Column: Heading, Context & CTA */}
                  <div className="lg:col-span-4 flex flex-col justify-between space-y-6 lg:space-y-0 lg:pr-4">
                    <div className="space-y-4">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#AF191A] block">
                        Rekam Jejak
                      </span>
                      <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#191919] leading-[1.15] tracking-tight">
                        {content.title || (
                          <>
                            Highlight
                            <br />
                            Rekam Kerja
                          </>
                        )}
                      </h2>
                      <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed pt-1">
                        <p>
                          {content.subtitle ||
                            'Program advokasi, kunjungan kerja lapangan, dan kegiatan pengabdian kemasyarakatan yang telah direalisasikan demi memperjuangkan aspirasi warga.'}
                        </p>
                        <p>
                          {content.description ||
                            'Mencakup inisiatif pemberdayaan ekonomi rakyat, fasilitasi pembangunan infrastruktur desa, hingga penguatan sektor pertanian dan pendidikan.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 lg:pt-0">
                      <Link
                        href="/rekam-kerja"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#AF191A] hover:text-[#8e1415] hover:underline group"
                      >
                        <span>Lihat Semua Rekam Kerja</span>
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: 2x2 Grid of 4 Cards */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {displayActivities.slice(0, getNumber(content.display_count, 4)).map((act) => (
                      <Link
                        key={act.id}
                        href={`/rekam-kerja/${act.slug}`}
                        className="group p-5 rounded-2xl border border-neutral-200/90 bg-white shadow-xs flex flex-col justify-between space-y-4 hover:border-[#AF191A]/60 hover:shadow-md transition-all overflow-hidden"
                      >
                        <div className="space-y-3">
                          {act.cover_image_url ? (
                            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100">
                              <img
                                src={act.cover_image_url}
                                alt={act.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="aspect-[16/9] w-full rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 font-mono text-xs">
                              🏛️ Rekam Kerja
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <span className="inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded bg-red-50 text-[#AF191A] border border-red-200/80">
                              {act.type}
                            </span>
                            {act.featured && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded bg-amber-100/80 text-amber-900 border border-amber-300">
                                ★ Unggulan
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-[#191919] group-hover:text-[#AF191A] transition-colors line-clamp-2 leading-snug">
                            {act.title}
                          </h3>
                          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                            {act.summary}
                          </p>
                        </div>
                        <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 font-medium border-t border-neutral-100/70">
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
                className="py-16 sm:py-20 px-6 border-b border-neutral-200 bg-neutral-50/50"
              >
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
                  {/* Left Column: Heading, Context & CTA */}
                  <div className="lg:col-span-4 flex flex-col justify-between space-y-6 lg:space-y-0 lg:pr-4">
                    <div className="space-y-4">
                      <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#AF191A] block">
                        Kabar &amp; Publikasi
                      </span>
                      <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-extrabold text-[#191919] leading-[1.15] tracking-tight">
                        {content.title || (
                          <>
                            Kabar &amp;
                            <br />
                            Gagasan Terbaru
                          </>
                        )}
                      </h2>
                      <div className="space-y-3 text-xs sm:text-sm text-neutral-600 leading-relaxed pt-1">
                        <p>
                          {content.subtitle ||
                            'Kumpulan tulisan pemikiran, siaran pers resmi, telaah kebijakan daerah, dan kabar kegiatan terbaru Rahmat Ichwan Bahtiar.'}
                        </p>
                        <p>
                          {content.description ||
                            'Menyajikan sudut pandang kritis, akuntabilitas kerja legislasi dan anggaran, serta ruang edukasi publik untuk kemajuan daerah.'}
                        </p>
                      </div>
                    </div>

                    <div className="pt-4 lg:pt-0">
                      <Link
                        href="/kabar"
                        className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#AF191A] hover:text-[#8e1415] hover:underline group"
                      >
                        <span>Lihat Semua Kabar &amp; Gagasan</span>
                        <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
                      </Link>
                    </div>
                  </div>

                  {/* Right Column: 2x2 Grid of 4 Cards */}
                  <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {displayArticles.slice(0, getNumber(content.display_count, 4)).map((art) => (
                      <Link
                        key={art.id}
                        href={`/kabar/${art.slug}`}
                        className="group p-5 rounded-2xl border border-neutral-200/90 bg-white shadow-xs flex flex-col justify-between space-y-4 hover:border-[#AF191A]/60 hover:shadow-md transition-all overflow-hidden"
                      >
                        <div className="space-y-3">
                          {art.cover_image_url ? (
                            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden bg-neutral-100 border border-neutral-100">
                              <img
                                src={art.cover_image_url}
                                alt={art.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ) : (
                            <div className="aspect-[16/9] w-full rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-400 font-mono text-xs">
                              {art.type === 'BERITA' ? '📰 Warta Liputan' : '💡 Catatan Gagasan'}
                            </div>
                          )}

                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase rounded ${
                                art.type === 'BERITA'
                                  ? 'bg-red-50 text-[#AF191A] border border-red-200/80'
                                  : 'bg-neutral-100 text-[#191919] border border-neutral-200'
                              }`}
                            >
                              {art.type}
                            </span>
                            {art.featured && (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold rounded bg-amber-100/80 text-amber-900 border border-amber-300">
                                ★ Unggulan
                              </span>
                            )}
                            {art.category && (
                              <span className="text-[10px] text-neutral-500 font-medium">
                                • {art.category}
                              </span>
                            )}
                          </div>
                          <h3 className="text-base font-bold text-[#191919] group-hover:text-[#AF191A] transition-colors line-clamp-2 leading-snug">
                            {art.title}
                          </h3>
                          <p className="text-xs text-neutral-500 line-clamp-2 leading-relaxed">
                            {art.excerpt}
                          </p>
                        </div>
                        <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 font-medium border-t border-neutral-100/70">
                          <span>
                            {art.published_at
                              ? art.published_at.slice(0, 10)
                              : art.created_at
                                ? art.created_at.slice(0, 10)
                                : '2026-02-14'}
                          </span>
                          <span className="font-semibold text-[#AF191A] group-hover:underline flex items-center gap-1">
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

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
