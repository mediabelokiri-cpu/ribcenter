import type { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { getProfile, getTimeline, getOrganizations } from '@/services/profile';
import { StructuredData } from '@/components/seo/structured-data';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Profil & Rekam Jejak - Rahmat Ichwan Bahtiar',
  description:
    'Mengenal rekam jejak, riwayat pendidikan, perjalanan karier kemasyarakatan, serta visi integritas pelayanan publik Rahmat Ichwan Bahtiar.',
  alternates: {
    canonical: '/tentang',
  },
};

interface MissionPoint {
  number: string;
  title: string;
  description: string;
}

function parseMissionPoints(missionText?: string | null): MissionPoint[] {
  if (!missionText || !missionText.trim()) return [];

  const clean = missionText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').trim();

  // Check if text has numbered items like "01 —", "02 —", "1.", etc.
  const blocks = clean
    .split(/(?:^|\n+)(?=(?:\d{1,2}\s*[-—.:)]\s*))/g)
    .map((b) => b.trim())
    .filter(Boolean);

  if (blocks.length >= 2) {
    return blocks.map((block, idx) => {
      const match = block.match(/^(\d{1,2})\s*[-—.:)]\s*([\s\S]*)$/);
      if (match) {
        const num = match[1].padStart(2, '0');
        const rest = match[2].trim();
        const lines = rest.split(/\n+/).map((l) => l.trim()).filter(Boolean);
        if (lines.length >= 2) {
          return {
            number: num,
            title: lines[0],
            description: lines.slice(1).join(' '),
          };
        } else if (lines.length === 1) {
          const parts = lines[0].match(/^(.*?)(?:\s*[:—\-]\s+)(.*)$/);
          if (parts && parts[1].length < 60) {
            return {
              number: num,
              title: parts[1].trim(),
              description: parts[2].trim(),
            };
          }
          return {
            number: num,
            title: lines[0],
            description: '',
          };
        }
      }
      return {
        number: String(idx + 1).padStart(2, '0'),
        title: '',
        description: block,
      };
    });
  }

  // Fallback: split by double newlines or single newlines
  const paragraphs = clean.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  if (paragraphs.length > 1) {
    return paragraphs.map((para, idx) => {
      const m = para.match(/^(?:(\d{1,2})|[-*•])\s*[-—.:)]?\s*([\s\S]*)$/);
      const num = m && m[1] ? m[1].padStart(2, '0') : String(idx + 1).padStart(2, '0');
      const content = m && m[2] ? m[2].trim() : para;
      const lines = content.split(/\n+/).map((l) => l.trim()).filter(Boolean);
      return {
        number: num,
        title: lines.length > 1 ? lines[0] : '',
        description: lines.length > 1 ? lines.slice(1).join(' ') : lines[0] || '',
      };
    });
  }

  const singleLines = clean.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (singleLines.length > 1) {
    return singleLines.map((line, idx) => {
      const m = line.match(/^(?:(\d{1,2})|[-*•])\s*[-—.:)]?\s*(.*)$/);
      return {
        number: m && m[1] ? m[1].padStart(2, '0') : String(idx + 1).padStart(2, '0'),
        title: '',
        description: m && m[2] ? m[2].trim() : line,
      };
    });
  }

  return [
    {
      number: '01',
      title: '',
      description: clean,
    },
  ];
}

export default async function TentangPage() {
  const [profile, timeline, organizations] = await Promise.all([
    getProfile(),
    getTimeline(true),
    getOrganizations(true),
  ]);

  const missionPoints = parseMissionPoints(profile?.mission);

  const education = Array.isArray(profile?.education)
    ? (profile.education as Array<{ degree: string; institution: string; year: string; field?: string }>)
    : [];

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile?.name || 'Rahmat Ichwan Bahtiar',
    jobTitle: profile?.title || 'Tokoh Publik & Pelayan Masyarakat',
    description: profile?.biography,
    url: `${siteUrl}/tentang`,
    image: `${siteUrl}/rahmat-hero.png`,
    alumniOf: education.map((e) => ({
      '@type': 'EducationalOrganization',
      name: e.institution,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      <StructuredData data={personJsonLd} />
      {/* Public Header */}
      <PublicHeader activeRoute="/tentang" />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 space-y-16">
        {/* 1. Profil & Biografi */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {profile?.photo_url ? (
              <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-[#AF191A] shadow-md shrink-0 bg-neutral-100">
                <img
                  src={profile.photo_url}
                  alt={profile.name || 'Rahmat Ichwan Bahtiar'}
                  className="w-full h-full object-cover object-top"
                />
              </div>
            ) : (
              <div className="w-36 h-36 rounded-2xl bg-neutral-900 border-2 border-[#AF191A] flex items-center justify-center text-4xl font-extrabold font-mono text-[#FFCC00] shadow-md shrink-0">
                RIB
              </div>
            )}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
                Profil Tokoh Publik
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#191919] tracking-tight">
                {profile?.name || 'Rahmat Ichwan Bahtiar'}
              </h1>
              <p className="text-base font-semibold text-[#AF191A]">
                {profile?.title || 'Tokoh Publik & Pelayan Masyarakat'}
              </p>
              <p className="text-sm text-neutral-600 pt-2 leading-relaxed">
                {profile?.biography}
              </p>
            </div>
          </div>

          {/* Visi & Misi */}
          <div className="space-y-6 pt-2">
            {/* Card Visi Kepemimpinan */}
            <div className="p-6 sm:p-8 rounded-2xl bg-white border-l-4 border-l-[#AF191A] border border-neutral-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#AF191A]"></span>
                <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
                  Visi Kepemimpinan
                </span>
              </div>
              <p className="text-lg sm:text-2xl font-bold text-[#191919] leading-relaxed italic">
                &ldquo;{profile?.vision || 'Mewujudkan kepemimpinan yang transparan, amanah, dan bekerja nyata untuk masyarakat.'}&rdquo;
              </p>
            </div>

            {/* Misi & Komitmen Pelayanan (Cards Per Poin) */}
            {missionPoints.length > 0 && (
              <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A] block">
                      Misi &amp; Komitmen Pelayanan
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#191919] tracking-tight mt-0.5">
                      Pilar Pengabdian &amp; Kerja Nyata
                    </h2>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {missionPoints.length} Poin Komitmen
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                  {missionPoints.map((item) => (
                    <div
                      key={item.number}
                      className="p-5 sm:p-6 rounded-xl bg-white border border-neutral-200 hover:border-[#AF191A]/40 hover:shadow-md transition-all flex flex-col justify-between space-y-3 group"
                    >
                      <div className="space-y-2">
                        <div className="flex items-start gap-3.5">
                          <span className="w-8 h-8 rounded-lg bg-[#AF191A] text-white text-xs font-black flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                            {item.number}
                          </span>
                          <div className="space-y-1 min-w-0">
                            {item.title ? (
                              <h3 className="text-sm sm:text-base font-bold text-[#191919] group-hover:text-[#AF191A] transition-colors leading-snug">
                                {item.title}
                              </h3>
                            ) : null}
                            {item.description ? (
                              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                                {item.description}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Riwayat Pendidikan */}
          {education.length > 0 && (
            <div className="p-6 rounded-xl bg-white border border-neutral-200 space-y-4 shadow-xs">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#AF191A]">
                Latar Belakang Pendidikan
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {education.map((edu, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-neutral-50 border border-neutral-200 space-y-1"
                  >
                    <span className="font-bold text-sm block text-[#191919]">{edu.institution}</span>
                    <span className="text-xs text-neutral-600 block">
                      {edu.degree} {edu.field ? `— ${edu.field}` : ''}
                    </span>
                    <span className="text-[11px] font-mono text-[#AF191A] font-semibold block">
                      Lulus Tahun {edu.year}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 2. Linimasa Perjalanan Politik */}
        <section className="space-y-6 pt-6 border-t border-neutral-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
              Jejak Langkah
            </span>
            <h2 className="text-2xl font-bold mt-1 text-[#191919]">
              Perjalanan Politik &amp; Pengabdian
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Tonggak rekam jejak, amanah legislatif, dan perjuangan kebijakan secara kronologis.
            </p>
          </div>

          {timeline.length === 0 ? (
            <p className="text-xs text-neutral-500 italic py-4">Belum ada linimasa yang dipublikasikan.</p>
          ) : (
            <div className="relative pl-6 border-l-2 border-[#AF191A] space-y-8">
              {timeline.map((item) => (
                <div key={item.id} className="relative group">
                  {/* Timeline Dot */}
                  <span className="absolute -left-[31px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#AF191A] border-4 border-white shadow-sm"></span>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded bg-[#191919] text-[#FFCC00]">
                        {item.year_start} {item.year_end ? `– ${item.year_end}` : '– Sekarang'}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20">
                        {item.category}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#191919] pt-1">
                      {item.title}
                    </h3>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 3. Rekam Jejak Organisasi */}
        <section className="space-y-6 pt-6 border-t border-neutral-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
              Kepemimpinan
            </span>
            <h2 className="text-2xl font-bold mt-1 text-[#191919]">
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
                  className="p-5 rounded-xl border border-neutral-200 bg-white shadow-xs space-y-2 hover:border-[#AF191A] transition-colors"
                >
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-neutral-500">
                      {org.period_start} {org.period_end ? `– ${org.period_end}` : ''}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[#191919]">
                    {org.organization_name}
                  </h3>
                  <p className="text-xs font-semibold text-[#AF191A]">
                    {org.role}
                  </p>
                  {org.description && (
                    <p className="text-xs text-neutral-600 pt-1 leading-relaxed">
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
      <PublicFooter />
    </div>
  );
}
