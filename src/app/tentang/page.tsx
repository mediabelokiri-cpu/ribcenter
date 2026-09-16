import { PublicHeader } from '@/components/layout/public-header';
import { getProfile, getTimeline, getOrganizations } from '@/services/profile';

export const dynamic = 'force-dynamic';

export default async function TentangPage() {
  const [profile, timeline, organizations] = await Promise.all([
    getProfile(),
    getTimeline(true),
    getOrganizations(true),
  ]);

  const education = Array.isArray(profile?.education)
    ? (profile.education as Array<{ degree: string; institution: string; year: string; field?: string }>)
    : [];

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      {/* Public Header */}
      <PublicHeader activeRoute="/tentang" />

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 space-y-16">
        {/* 1. Profil & Biografi */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-36 h-36 rounded-2xl bg-neutral-900 border-2 border-[#AF191A] flex items-center justify-center text-4xl font-extrabold font-mono text-[#FFCC00] shadow-md shrink-0">
              RIB
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-xl bg-white border-l-4 border-l-[#AF191A] border-y border-r border-neutral-200 space-y-2 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
                Visi Kepemimpinan
              </span>
              <p className="text-sm font-medium text-neutral-800 leading-relaxed italic">
                &ldquo;{profile?.vision || 'Mewujudkan kepemimpinan yang transparan dan akuntabel.'}&rdquo;
              </p>
            </div>

            <div className="p-6 rounded-xl bg-white border-l-4 border-l-[#FFCC00] border-y border-r border-neutral-200 space-y-2 shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
                Misi &amp; Komitmen Pelayanan
              </span>
              <p className="text-sm text-neutral-600 leading-relaxed">
                {profile?.mission}
              </p>
            </div>
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
      <footer className="py-12 px-6 bg-white border-t border-neutral-200 text-xs text-neutral-500 text-center mt-12">
        <div className="max-w-5xl mx-auto space-y-2">
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
