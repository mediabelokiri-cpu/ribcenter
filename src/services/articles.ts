import { executeServerQuery } from '@/services/supabase';
import type { Article, ArticleType, ContentStatus } from '@/types/database';

export interface ArticleInput {
  title: string;
  slug: string;
  type: ArticleType;
  excerpt?: string | null;
  content: string;
  cover_image_url?: string | null;
  category?: string | null;
  author?: string;
  published_at?: string | null;
  status?: ContentStatus;
  featured?: boolean;
  related_activity_id?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
}

export interface RelatedActivitySummary {
  id: string;
  title: string;
  slug: string;
  type: string;
}

export interface ArticleWithRelatedActivity extends Article {
  related_activity?: RelatedActivitySummary | null;
}

// In-memory fallback store for development resilience
let fallbackArticlesStore: Article[] = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    title: 'Peluncuran Platform Keterbukaan Informasi & Akuntabilitas Publik',
    slug: 'peluncuran-platform-akuntabilitas-publik',
    type: 'BERITA',
    excerpt: 'Platform resmi Rahmat Ichwan Bahtiar diluncurkan untuk memastikan seluruh rekam kerja dan kegiatan dapat diakses secara transparan oleh warga.',
    content: `Platform resmi Rahmat Ichwan Bahtiar resmi diluncurkan sebagai wujud komitmen nyata terhadap akuntabilitas dan transparansi pelayanan publik di Sulawesi Barat.

Melalui platform ini, masyarakat dapat memantau secara langsung:
1. Rekam jejak kegiatan, program advokasi, dan penyerapan aspirasi reses di setiap kabupaten.
2. Artikel kabar, laporan kerja lapangan, serta siaran pers berkala.
3. Catatan gagasan dan pemikiran kebijakan pembangunan daerah.
4. Kanal aspirasi warga yang terstruktur dan aman.

Keterbukaan informasi bukan sekadar slogan seremonial, melainkan pilar utama dalam membangun kepercayaan antara wakil rakyat dan konstituennya.`,
    cover_image_url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    category: 'Publikasi',
    author: 'Rahmat Ichwan Bahtiar',
    published_at: '2026-03-01T08:00:00.000Z',
    status: 'PUBLISHED',
    featured: true,
    related_activity_id: null,
    seo_title: 'Peluncuran Platform Keterbukaan Informasi Publik - Rahmat Ichwan Bahtiar',
    seo_description: 'Platform resmi akuntabilitas dan rekam jejak pengabdian Rahmat Ichwan Bahtiar untuk masyarakat.',
    created_at: '2026-03-01T08:00:00.000Z',
    updated_at: '2026-03-01T08:00:00.000Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    title: 'Gagasan: Mendorong Tata Kelola Komoditas Kakao yang Berkeadilan di Mandar',
    slug: 'mendorong-tata-kelola-komoditas-kakao-berkeadilan-mandar',
    type: 'GAGASAN',
    excerpt: 'Catatan pemikiran mengenai penguatan posisi tawar petani kakao, stabilisasi harga gabah/biji kakao, dan modernisasi pascapanen.',
    content: `Sulawesi Barat memiliki modal historis dan ekologis yang kuat sebagai sentra perkebunan kakao nasional. Namun, tantangan yang dihadapi petani hari ini masih berkutat pada fluktuasi harga, serangan hama penyakit, serta keterbatasan akses sarana produksi berkualitas.

Ada tiga langkah strategis yang perlu kita dorong bersama:
- **Revitalisasi Tanaman Tua**: Program sambung pucuk dan penyediaan bibit bersertifikat secara berkesinambungan.
- **Penguatan Lembaga Petani (Korporasi Petani)**: Memastikan petani tidak menjual dalam posisi tertekan melalui hilirisasi skala kelompok usaha.
- **Jaminan Rantai Pasok**: Menghubungkan sentra perkebunan desa dengan industri pengolahan secara transparan.

Kesejahteraan petani adalah fondasi ketahanan ekonomi daerah yang tidak bisa ditawar.`,
    cover_image_url: 'https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=80',
    category: 'Kebijakan Publik',
    author: 'Rahmat Ichwan Bahtiar',
    published_at: '2026-03-05T09:30:00.000Z',
    status: 'PUBLISHED',
    featured: true,
    related_activity_id: null,
    seo_title: 'Gagasan Tata Kelola Kakao Mandar - Rahmat Ichwan Bahtiar',
    seo_description: 'Pemikiran kebijakan strategis penguatan ekonomi petani kakao di Sulawesi Barat.',
    created_at: '2026-03-05T09:30:00.000Z',
    updated_at: '2026-03-05T09:30:00.000Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    title: 'Tinjauan Lapangan Penyaluran Bantuan Alsintan untuk Gapoktan Polewali Mandar',
    slug: 'tinjauan-lapangan-bantuan-alsintan-gapoktan-polman',
    type: 'BERITA',
    excerpt: 'Peninjauan langsung serah terima traktor tangan dan pompa air untuk meningkatkan produktivitas panen musim tanam pertama.',
    content: `Sebanyak 15 unit traktor tangan dan 20 unit pompa air didistribusikan kepada gabungan kelompok tani di Kabupaten Polewali Mandar. 

Dalam peninjauan lapangan, Rahmat Ichwan Bahtiar menegaskan pentingnya pemanfaatan alat mesin pertanian secara optimal dan transparan dalam kelompok. Perawatan berkala serta pengelolaan bersama yang demokratis menjadi kunci keberlanjutan bantuan pemerintah ini.`,
    cover_image_url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
    category: 'Advokasi',
    author: 'Rahmat Ichwan Bahtiar',
    published_at: '2026-03-08T11:00:00.000Z',
    status: 'PUBLISHED',
    featured: false,
    related_activity_id: null,
    seo_title: 'Penyaluran Bantuan Alsintan di Polman - Rahmat Ichwan Bahtiar',
    seo_description: 'Laporan peninjauan penyaluran bantuan sarana pertanian di Polewali Mandar.',
    created_at: '2026-03-08T11:00:00.000Z',
    updated_at: '2026-03-08T11:00:00.000Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000004',
    title: 'Pentingnya Digitalisasi Pelayanan Publik di Daerah Pesisir dan Kepulauan',
    slug: 'digitalisasi-pelayanan-publik-daerah-pesisir-kepulauan',
    type: 'GAGASAN',
    excerpt: 'Aksesibilitas layanan kependudukan dan perizinan harus menjangkau warga hingga ke pelosok pesisir tanpa kendala jarak.',
    content: `Karakteristik geografis kepulauan dan pesisir seringkali menjadi kendala administrasi bagi warga. Gagasan digitalisasi layanan publik bukan sekadar pengadaan aplikasi, melainkan kepastian jaringan komunikasi dan literasi bagi aparatur di tingkat desa.

Kita harus memperjuangkan infrastruktur telekomunikasi yang merata agar anak-anak di pulau terluar memiliki kesempatan yang setara dalam mengakses pendidikan dan informasi.`,
    cover_image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    category: 'Opini',
    author: 'Rahmat Ichwan Bahtiar',
    published_at: '2026-03-10T14:00:00.000Z',
    status: 'PUBLISHED',
    featured: false,
    related_activity_id: null,
    seo_title: 'Digitalisasi Layanan Publik Pesisir - Rahmat Ichwan Bahtiar',
    seo_description: 'Opini gagasan pembangunan konektivitas dan layanan digital untuk warga pesisir.',
    created_at: '2026-03-10T14:00:00.000Z',
    updated_at: '2026-03-10T14:00:00.000Z',
  },
  {
    id: '30000000-0000-0000-0000-000000000005',
    title: '[DRAFT INTERNAL] Rencana Pembentukan Rumah Aspirasi Mandar',
    slug: 'draft-rencana-pembentukan-rumah-aspirasi-mandar',
    type: 'BERITA',
    excerpt: 'Draf konsep operasional rumah aspirasi warga yang belum dipublikasikan.',
    content: 'Draf materi internal mengenai standar operasional penyerapan aspirasi.',
    cover_image_url: null,
    category: 'Internal',
    author: 'Rahmat Ichwan Bahtiar',
    published_at: null,
    status: 'DRAFT',
    featured: false,
    related_activity_id: null,
    seo_title: null,
    seo_description: null,
    created_at: '2026-03-11T10:00:00.000Z',
    updated_at: '2026-03-11T10:00:00.000Z',
  },
];

export interface GetArticlesOptions {
  type?: ArticleType;
  featuredOnly?: boolean;
  category?: string;
  search?: string;
  limit?: number;
}

/**
 * Public query: strictly retrieves only PUBLISHED articles.
 * DRAFT and ARCHIVED articles are never returned.
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
    if (options.category) {
      query = query.eq('category', options.category);
    }
    if (options.search) {
      query = query.or(`title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%`);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }

    return query;
  });

  if (result.data && !result.error) {
    return result.data as Article[];
  }

  // Fallback filtering
  return fallbackArticlesStore
    .filter((a) => {
      if (a.status !== 'PUBLISHED') return false;
      if (options.type && a.type !== options.type) return false;
      if (options.featuredOnly && !a.featured) return false;
      if (options.category && a.category !== options.category) return false;
      if (options.search) {
        const s = options.search.toLowerCase();
        const matchesTitle = a.title.toLowerCase().includes(s);
        const matchesExcerpt = a.excerpt ? a.excerpt.toLowerCase().includes(s) : false;
        if (!matchesTitle && !matchesExcerpt) return false;
      }
      return true;
    })
    .slice(0, options.limit || fallbackArticlesStore.length);
}

/**
 * Public query: strictly retrieves a single PUBLISHED article by slug.
 * Also retrieves related activity summary if related_activity_id is present.
 */
export async function getArticleBySlug(
  slug: string
): Promise<ArticleWithRelatedActivity | null> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('articles')
      .select('*, related_activity:activities(id, title, slug, type)')
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as unknown as ArticleWithRelatedActivity;
  }

  const found = fallbackArticlesStore.find(
    (a) => a.slug === slug && a.status === 'PUBLISHED'
  );
  if (!found) return null;

  return {
    ...found,
    related_activity: null,
  };
}

/**
 * Admin query: retrieves a single article by ID across all statuses.
 */
export async function getArticleByIdForAdmin(
  id: string
): Promise<Article | null> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('articles')
      .select('*')
      .eq('id', id)
      .maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as Article;
  }

  return fallbackArticlesStore.find((a) => a.id === id) || null;
}

/**
 * Admin query: retrieves articles across all statuses (PUBLISHED, DRAFT, ARCHIVED).
 */
export async function getAllArticlesForAdmin(
  options: { type?: ArticleType; status?: ContentStatus } = {}
): Promise<Article[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase
      .from('articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (options.type) {
      query = query.eq('type', options.type);
    }
    if (options.status) {
      query = query.eq('status', options.status);
    }

    return query;
  });

  if (result.data && !result.error) {
    return result.data as Article[];
  }

  return fallbackArticlesStore.filter((a) => {
    if (options.type && a.type !== options.type) return false;
    if (options.status && a.status !== options.status) return false;
    return true;
  });
}

/**
 * Checks whether a given slug is available (not taken by another article).
 */
export async function isArticleSlugAvailable(
  slug: string,
  excludeId?: string
): Promise<boolean> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase
      .from('articles')
      .select('id')
      .eq('slug', slug);

    if (excludeId) {
      query = query.neq('id', excludeId);
    }

    return query;
  });

  if (result.data && !result.error) {
    return result.data.length === 0;
  }

  return !fallbackArticlesStore.some(
    (a) => a.slug === slug && (!excludeId || a.id !== excludeId)
  );
}

/**
 * Admin mutation: creates a new article (Berita or Gagasan).
 */
export async function createArticle(input: ArticleInput): Promise<Article> {
  const now = new Date().toISOString();
  const publishedAt = input.status === 'PUBLISHED'
    ? (input.published_at || now)
    : (input.published_at || null);

  const payload = {
    title: input.title,
    slug: input.slug,
    type: input.type,
    excerpt: input.excerpt || null,
    content: input.content,
    cover_image_url: input.cover_image_url || null,
    category: input.category || null,
    author: input.author || 'Rahmat Ichwan Bahtiar',
    published_at: publishedAt,
    status: input.status || 'DRAFT',
    featured: !!input.featured,
    related_activity_id: input.related_activity_id || null,
    seo_title: input.seo_title || null,
    seo_description: input.seo_description || null,
  };

  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('articles')
      .insert(payload)
      .select('*')
      .single();
  });

  if (result.data && !result.error) {
    return result.data as Article;
  }

  // Fallback in-memory insertion
  const newArticle: Article = {
    id: `art-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    ...payload,
    created_at: now,
    updated_at: now,
  };
  fallbackArticlesStore.unshift(newArticle);
  return newArticle;
}

/**
 * Admin mutation: updates an existing article.
 */
export async function updateArticle(
  id: string,
  input: Partial<ArticleInput>
): Promise<Article> {
  const now = new Date().toISOString();
  const updateData: Record<string, unknown> = {
    updated_at: now,
  };

  if (input.title !== undefined) updateData.title = input.title;
  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.type !== undefined) updateData.type = input.type;
  if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
  if (input.content !== undefined) updateData.content = input.content;
  if (input.cover_image_url !== undefined) updateData.cover_image_url = input.cover_image_url;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.author !== undefined) updateData.author = input.author;
  if (input.published_at !== undefined) updateData.published_at = input.published_at;
  if (input.status !== undefined) {
    updateData.status = input.status;
    if (input.status === 'PUBLISHED' && !input.published_at) {
      updateData.published_at = now;
    }
  }
  if (input.featured !== undefined) updateData.featured = input.featured;
  if (input.related_activity_id !== undefined) updateData.related_activity_id = input.related_activity_id;
  if (input.seo_title !== undefined) updateData.seo_title = input.seo_title;
  if (input.seo_description !== undefined) updateData.seo_description = input.seo_description;

  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('articles')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();
  });

  if (result.data && !result.error) {
    return result.data as Article;
  }

  // Fallback in-memory update
  const index = fallbackArticlesStore.findIndex((a) => a.id === id);
  if (index === -1) {
    throw new Error(`Artikel dengan ID "${id}" tidak ditemukan.`);
  }

  const updated: Article = {
    ...fallbackArticlesStore[index],
    ...updateData,
  } as Article;

  fallbackArticlesStore[index] = updated;
  return updated;
}

/**
 * Admin mutation: deletes an article by ID.
 */
export async function deleteArticle(id: string): Promise<boolean> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('articles')
      .delete()
      .eq('id', id);
  });

  if (!result.error) {
    fallbackArticlesStore = fallbackArticlesStore.filter((a) => a.id !== id);
    return true;
  }

  const initialLen = fallbackArticlesStore.length;
  fallbackArticlesStore = fallbackArticlesStore.filter((a) => a.id !== id);
  return fallbackArticlesStore.length < initialLen;
}

/**
 * Get distinct article categories currently used in articles.
 */
export async function getDistinctArticleCategories(): Promise<string[]> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('articles')
      .select('category')
      .not('category', 'is', null);
  });

  if (result.data && !result.error) {
    const raw = result.data as Array<{ category: string | null }>;
    const set = new Set<string>();
    for (const r of raw) {
      if (r.category && r.category.trim()) {
        set.add(r.category.trim());
      }
    }
    return Array.from(set).sort();
  }

  const set = new Set<string>();
  for (const a of fallbackArticlesStore) {
    if (a.category && a.category.trim()) {
      set.add(a.category.trim());
    }
  }
  return Array.from(set).sort();
}
