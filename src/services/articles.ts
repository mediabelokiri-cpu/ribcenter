import { executeServerQuery } from '@/services/supabase';
import type { Article, ArticleType } from '@/types/database';

const FALLBACK_ARTICLES: Article[] = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    title: '[DUMMY] Berita Peluncuran Platform Akuntabilitas',
    slug: 'peluncuran-platform-akuntabilitas-test',
    type: 'BERITA',
    excerpt: 'Platform resmi Rahmat Ichwan Bahtiar disiapkan untuk keterbukaan informasi.',
    content: 'Isi lengkap berita uji coba mengenai peluncuran platform informasi publik.',
    cover_image_url: null,
    category: 'Publikasi',
    author: 'Rahmat Ichwan Bahtiar',
    published_at: new Date().toISOString(),
    status: 'PUBLISHED',
    featured: true,
    related_activity_id: null,
    seo_title: null,
    seo_description: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    title: '[DUMMY] Gagasan: Pentingnya Transparansi Pelayanan Publik',
    slug: 'pentingnya-transparansi-pelayanan-publik-test',
    type: 'GAGASAN',
    excerpt: 'Opini dan catatan pemikiran mengenai integritas dalam melayani warga.',
    content: 'Isi lengkap artikel gagasan uji coba untuk validasi filter GAGASAN.',
    cover_image_url: null,
    category: 'Opini',
    author: 'Rahmat Ichwan Bahtiar',
    published_at: new Date().toISOString(),
    status: 'PUBLISHED',
    featured: false,
    related_activity_id: null,
    seo_title: null,
    seo_description: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    title: '[DUMMY] DRAFT Artikel Belum Tayang',
    slug: 'draft-artikel-belum-tayang-test',
    type: 'BERITA',
    excerpt: 'Artikel berstatus draft untuk pengujian keamanan.',
    content: 'Konten privat berstatus draft yang dilarang bocor ke publik.',
    cover_image_url: null,
    category: 'Internal',
    author: 'Rahmat Ichwan Bahtiar',
    published_at: null,
    status: 'DRAFT',
    featured: false,
    related_activity_id: null,
    seo_title: null,
    seo_description: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export interface GetArticlesOptions {
  type?: ArticleType;
  featuredOnly?: boolean;
  limit?: number;
}

/**
 * Public query: strictly retrieves only PUBLISHED articles.
 * DRAFT articles are never returned.
 */
export async function getPublishedArticles(
  options: GetArticlesOptions = {}
): Promise<Article[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase
      .from('articles')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('published_at', { ascending: false });

    if (options.type) {
      query = query.eq('type', options.type);
    }
    if (options.featuredOnly) {
      query = query.eq('featured', true);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    return query;
  });

  if (result.data && !result.error) {
    return result.data as Article[];
  }

  return FALLBACK_ARTICLES.filter((a) => {
    if (a.status !== 'PUBLISHED') return false;
    if (options.type && a.type !== options.type) return false;
    if (options.featuredOnly && !a.featured) return false;
    return true;
  }).slice(0, options.limit || FALLBACK_ARTICLES.length);
}

/**
 * Public query: strictly retrieves a single PUBLISHED article by slug.
 */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as Article;
  }

  const found = FALLBACK_ARTICLES.find(
    (a) => a.slug === slug && a.status === 'PUBLISHED'
  );
  return found || null;
}

/**
 * Admin query: retrieves articles across all statuses.
 */
export async function getAllArticlesForAdmin(): Promise<Article[]> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });
  });

  if (result.data && !result.error) {
    return result.data as Article[];
  }

  return FALLBACK_ARTICLES;
}
