import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { getActivityBySlug } from '@/services/activities';
import { StructuredData } from '@/components/seo/structured-data';
import type { ActivityType } from '@/types/database';

export const dynamic = 'force-dynamic';

interface RekamKerjaDetailProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: RekamKerjaDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);

  if (!activity) {
    return {
      title: 'Rekam Kerja Tidak Ditemukan',
    };
  }

  const title = `${activity.title} | Rekam Kerja Rahmat Ichwan Bahtiar`;
  const description = activity.summary || `Dokumentasi dan laporan akuntabilitas kegiatan ${activity.title}.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/rekam-kerja/${activity.slug}`,
      images: [
        {
          url: activity.cover_image_url || '/logo.png',
          width: 1200,
          height: 630,
          alt: activity.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [activity.cover_image_url || '/logo.png'],
    },
    alternates: {
      canonical: `/rekam-kerja/${activity.slug}`,
    },
  };
}

export default async function RekamKerjaDetailPage({ params }: RekamKerjaDetailProps) {
  const { slug } = await params;
  const activity = await getActivityBySlug(slug);

  if (!activity) {
    notFound();
  }

  const getTypeBadge = (type: ActivityType) => {
    switch (type) {
      case 'REKAM_KERJA':
        return 'bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20';
      case 'PROGRAM':
        return 'bg-neutral-100 text-[#191919] border border-neutral-300';
      case 'KEGIATAN':
        return 'bg-[#FFCC00]/20 text-[#191919] border border-[#FFCC00]/50';
      case 'RESES':
        return 'bg-purple-50 text-purple-900 border border-purple-200';
    }
  };

  // Helper to extract YouTube embed URL
  const getEmbedUrl = (url: string | null) => {
    if (!url) return null;
    try {
      if (url.includes('youtube.com/watch')) {
        const v = new URL(url).searchParams.get('v');
        return v ? `https://www.youtube.com/embed/${v}` : null;
      }
      if (url.includes('youtu.be/')) {
        const parts = url.split('youtu.be/');
        const v = parts[1]?.split('?')[0];
        return v ? `https://www.youtube.com/embed/${v}` : null;
      }
      if (url.includes('youtube.com/embed/')) {
        return url;
      }
      return null;
    } catch {
      return null;
    }
  };

  const embedUrl = getEmbedUrl(activity.video_url);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const activityJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: activity.title,
    description: activity.summary || activity.title,
    image: activity.cover_image_url ? [activity.cover_image_url] : undefined,
    datePublished: activity.date || activity.created_at,
    dateModified: activity.updated_at || activity.date || activity.created_at,
    author: {
      '@type': 'Person',
      name: 'Rahmat Ichwan Bahtiar',
    },
    publisher: {
      '@type': 'Organization',
      name: 'RIB CENTER',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/rekam-kerja/${activity.slug}`,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      <StructuredData data={activityJsonLd} />
      {/* Public Header with White Background & RIB CENTER Branding */}
      <PublicHeader activeRoute="/rekam-kerja" />

      {/* Main Content */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-12 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#AF191A] transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/rekam-kerja" className="hover:text-[#AF191A] transition-colors">Rekam Kerja</Link>
          <span>/</span>
          <span className="text-[#AF191A] font-semibold truncate max-w-xs">{activity.title}</span>
        </nav>

        {/* Header Metadata */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-block px-3 py-1 text-xs font-semibold border rounded-lg ${getTypeBadge(
                activity.type
              )}`}
            >
              {activity.type}
            </span>
            {activity.category && (
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-lg bg-neutral-100 text-neutral-700">
                {activity.category.name}
              </span>
            )}
            {activity.featured && (
              <span className="inline-block px-3 py-1 text-xs font-bold rounded-lg bg-[#FFCC00] text-[#191919]">
                ★ Program Unggulan
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#191919] leading-tight">
            {activity.title}
          </h1>
        </div>

        {/* Accountability Facts Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs text-xs">
          <div>
            <span className="block text-[11px] font-bold text-[#AF191A] uppercase tracking-wider mb-1">
              Tanggal
            </span>
            <span className="font-mono font-bold text-neutral-800">
              {activity.date}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#AF191A] uppercase tracking-wider mb-1">
              Wilayah / Kabupaten
            </span>
            <span className="font-semibold text-neutral-800">
              {activity.regency || '-'}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#AF191A] uppercase tracking-wider mb-1">
              Kecamatan / Lokasi
            </span>
            <span className="text-neutral-800">
              {activity.district ? `${activity.district}` : activity.location || '-'}
            </span>
          </div>

          <div>
            <span className="block text-[11px] font-bold text-[#AF191A] uppercase tracking-wider mb-1">
              Penerima Manfaat
            </span>
            <span className="font-bold text-[#AF191A]">
              {activity.beneficiaries > 0 ? `${activity.beneficiaries.toLocaleString('id-ID')} orang/kelompok` : 'Masyarakat Umum'}
            </span>
          </div>
        </div>

        {/* Lead Summary */}
        {activity.summary && (
          <div className="p-5 rounded-2xl bg-[#AF191A]/5 border-l-4 border-l-[#AF191A] border-y border-r border-neutral-200 text-sm sm:text-base font-medium text-neutral-800 leading-relaxed italic">
            &ldquo;{activity.summary}&rdquo;
          </div>
        )}

        {/* Documentation Photo / Cover */}
        {activity.cover_image_url && (
          <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={activity.cover_image_url}
              alt={activity.title}
              className="w-full h-auto max-h-[500px] object-cover"
            />
            <div className="p-3 bg-neutral-50 text-center text-xs text-neutral-500">
              Dokumentasi: {activity.title}
            </div>
          </div>
        )}

        {/* Full Narrative Description */}
        <div className="p-8 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-6">
          <h2 className="text-lg font-bold text-[#191919] border-b border-neutral-100 pb-3">
            Laporan &amp; Uraian Kegiatan
          </h2>
          <div className="text-sm sm:text-base text-neutral-700 leading-relaxed whitespace-pre-line space-y-4">
            {activity.description}
          </div>
        </div>

        {/* Video Documentation Section */}
        {activity.video_url && (
          <div className="p-6 rounded-2xl bg-white border border-neutral-200 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#191919]">
              Dokumentasi Video
            </h2>
            {embedUrl ? (
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
                <iframe
                  src={embedUrl}
                  title={`Video ${activity.title}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0"
                />
              </div>
            ) : (
              <div>
                <a
                  href={activity.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-xl bg-[#AF191A] text-white hover:bg-[#921415] transition-colors shadow-xs"
                >
                  Tonton Video Dokumentasi di Layanan Eksternal &rarr;
                </a>
              </div>
            )}
          </div>
        )}

        {/* Bottom Navigation */}
        <div className="pt-6 border-t border-neutral-200 flex justify-between items-center">
          <Link
            href="/rekam-kerja"
            className="inline-flex items-center text-xs font-semibold text-[#AF191A] hover:underline"
          >
            &larr; Kembali ke Semua Rekam Kerja
          </Link>
          <Link
            href="/aspirasi"
            className="text-xs text-neutral-500 hover:text-[#AF191A] transition-colors"
          >
            Sampaikan Aspirasi Mengenai Program Ini &rarr;
          </Link>
        </div>
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
