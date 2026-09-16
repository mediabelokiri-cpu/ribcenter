/* eslint-disable @next/next/no-img-element */
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';
import { getArticleBySlug } from '@/services/articles';
import { StructuredData } from '@/components/seo/structured-data';

export const dynamic = 'force-dynamic';

interface DetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article || article.status !== 'PUBLISHED') {
    return {
      title: 'Artikel Tidak Ditemukan - Rahmat Ichwan Bahtiar',
    };
  }

  const title = article.seo_title || `${article.title} - Rahmat Ichwan Bahtiar`;
  const description =
    article.seo_description ||
    article.excerpt ||
    'Artikel publikasi resmi dan catatan pemikiran Rahmat Ichwan Bahtiar.';

  return {
    title,
    description,
    alternates: {
      canonical: `/kabar/${article.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/kabar/${article.slug}`,
      type: 'article',
      publishedTime: article.published_at || undefined,
      authors: [article.author],
      images: article.cover_image_url ? [{ url: article.cover_image_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: article.cover_image_url ? [article.cover_image_url] : undefined,
    },
  };
}

function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(iso: string | null): string {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default async function ArticleDetailPage({ params }: DetailPageProps) {
  const { slug } = await params;

  const article = await getArticleBySlug(slug);

  if (!article || article.status !== 'PUBLISHED') {
    notFound();
  }

  const readingTime = calculateReadingTime(article.content);
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': article.type === 'BERITA' ? 'NewsArticle' : 'Article',
    headline: article.title,
    description: article.excerpt || article.seo_description || article.title,
    image: article.cover_image_url ? [article.cover_image_url] : undefined,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at || article.published_at || article.created_at,
    author: [
      {
        '@type': 'Person',
        name: article.author || 'Rahmat Ichwan Bahtiar',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'KAWAN RIB — Rahmat Ichwan Bahtiar',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/rahmat-hero.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteUrl}/kabar/${article.slug}`,
    },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      <StructuredData data={articleJsonLd} />
      {/* Public Header with Black Background & KAWAN RIB Branding */}
      <PublicHeader activeRoute="/kabar" />

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 space-y-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-neutral-500">
          <Link href="/" className="hover:text-[#AF191A]">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/kabar" className="hover:text-[#AF191A]">
            Kabar
          </Link>
          <span>/</span>
          <Link
            href={article.type === 'GAGASAN' ? '/kabar/gagasan' : '/kabar/berita'}
            className="hover:text-[#AF191A]"
          >
            {article.type === 'GAGASAN' ? 'Gagasan' : 'Berita'}
          </Link>
          <span>/</span>
          <span className="text-neutral-400 truncate max-w-xs">{article.title}</span>
        </nav>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-block px-2.5 py-1 text-xs font-bold rounded ${
                article.type === 'BERITA'
                  ? 'bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20'
                  : 'bg-neutral-100 text-[#191919] border border-neutral-300'
              }`}
            >
              {article.type}
            </span>
            {article.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-semibold rounded bg-[#FFCC00]/25 text-[#191919] border border-[#FFCC00]/50">
                ★ Unggulan
              </span>
            )}
            {article.category && (
              <span className="text-xs font-medium text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded">
                {article.category}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black text-[#191919] leading-tight tracking-tight">
            {article.title}
          </h1>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 pt-2 border-y border-neutral-200 py-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-[#191919] text-[#FFCC00] text-xs font-mono font-bold flex items-center justify-center">
                RIB
              </span>
              <span className="font-semibold text-[#191919]">{article.author}</span>
            </div>
            <span>•</span>
            <time dateTime={article.published_at || undefined}>
              {formatDate(article.published_at || article.created_at)}
            </time>
            <span>•</span>
            <span>Estimasi baca: {readingTime} menit</span>
          </div>
        </header>

        {/* Cover Image */}
        {article.cover_image_url && (
          <div className="rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200">
            <img
              src={article.cover_image_url}
              alt={article.title}
              className="w-full max-h-[480px] object-cover"
            />
          </div>
        )}

        {/* Excerpt Summary Box */}
        {article.excerpt && (
          <div className="p-5 bg-neutral-50 border-l-4 border-[#AF191A] rounded-r-xl">
            <p className="text-sm font-medium text-neutral-700 leading-relaxed italic">
              &ldquo;{article.excerpt}&rdquo;
            </p>
          </div>
        )}

        {/* Main Body Content */}
        <article className="prose prose-neutral max-w-none text-neutral-800 leading-relaxed text-sm sm:text-base space-y-4">
          {article.content.split('\n\n').map((paragraph, index) => {
            const trimmed = paragraph.trim();
            if (!trimmed) return null;

            // Headings
            if (trimmed.startsWith('## ')) {
              return (
                <h2 key={index} className="text-xl sm:text-2xl font-bold text-[#191919] pt-4 pb-1 border-b border-neutral-100">
                  {trimmed.replace('## ', '')}
                </h2>
              );
            }
            if (trimmed.startsWith('### ')) {
              return (
                <h3 key={index} className="text-lg font-bold text-[#191919] pt-2">
                  {trimmed.replace('### ', '')}
                </h3>
              );
            }

            // Quotes
            if (trimmed.startsWith('> ')) {
              return (
                <blockquote key={index} className="border-l-4 border-neutral-300 pl-4 py-1 my-3 text-neutral-600 italic">
                  {trimmed.replace(/^>\s*/gm, '')}
                </blockquote>
              );
            }

            // Unordered List
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
              const items = trimmed.split('\n').filter((l) => l.trim().startsWith('- ') || l.trim().startsWith('* '));
              return (
                <ul key={index} className="list-disc list-inside space-y-1 my-3 text-neutral-700">
                  {items.map((item, itemIdx) => (
                    <li key={itemIdx}>{item.replace(/^[-*]\s*/, '')}</li>
                  ))}
                </ul>
              );
            }

            // Regular paragraph
            return (
              <p key={index} className="leading-relaxed">
                {trimmed}
              </p>
            );
          })}
        </article>

        {/* Related Activity Connection Card (if present) */}
        {article.related_activity && (
          <div className="p-5 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-2 mt-8">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
                🔗 Rekam Kerja Terhubung
              </span>
              <span className="text-[10px] bg-[#AF191A]/10 text-[#AF191A] font-semibold px-2 py-0.5 rounded">
                {article.related_activity.type}
              </span>
            </div>
            <h4 className="text-sm font-bold text-[#191919]">
              {article.related_activity.title}
            </h4>
            <p className="text-xs text-neutral-500">
              Artikel ini terhubung secara resmi dengan data akuntabilitas rekam kerja lapangan.
            </p>
            <Link
              href={`/rekam-kerja/${article.related_activity.slug}`}
              className="inline-flex items-center text-xs font-semibold text-[#AF191A] hover:underline pt-1"
            >
              Lihat Detail Rekam Kerja &rarr;
            </Link>
          </div>
        )}

        {/* Bottom Navigation & Share Bar */}
        <div className="pt-8 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/kabar"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-[#AF191A] transition-colors"
          >
            &larr; Kembali ke Semua Kabar
          </Link>

          <div className="flex items-center gap-3 text-xs text-neutral-500">
            <span>Bagikan artikel ini:</span>
            <Link
              href={`https://wa.me/?text=${encodeURIComponent(`${article.title} - Baca selengkapnya di: ${siteUrl}/kabar/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-emerald-500 hover:text-emerald-700 bg-white transition-colors font-medium"
            >
              WhatsApp
            </Link>
            <Link
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`${siteUrl}/kabar/${article.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-900 hover:text-neutral-900 bg-white transition-colors font-medium"
            >
              X (Twitter)
            </Link>
          </div>
        </div>
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
