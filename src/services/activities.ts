import { executeServerQuery } from '@/services/supabase';
import type { Activity, ActivityType } from '@/types/database';

const FALLBACK_ACTIVITIES: Activity[] = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    title: '[DUMMY] Laporan Kegiatan Reses Wilayah Uji',
    slug: 'laporan-reses-wilayah-uji',
    type: 'RESES',
    category_id: '10000000-0000-0000-0000-000000000001',
    date: '2026-01-15',
    location: 'Kecamatan Contoh',
    regency: 'Kabupaten Contoh',
    district: 'Kecamatan Contoh',
    summary: 'Ringkasan kegiatan reses dalam rangka pengujian teknis database.',
    description: 'Deskripsi lengkap pelaksanaan kegiatan reses uji coba.',
    beneficiaries: 0,
    status: 'PUBLISHED',
    featured: true,
    cover_image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    title: '[DUMMY] Program Bantuan Sosial Uji Coba',
    slug: 'program-bansos-uji-coba',
    type: 'PROGRAM',
    category_id: '10000000-0000-0000-0000-000000000001',
    date: '2026-02-10',
    location: 'Desa Contoh',
    regency: 'Kabupaten Contoh',
    district: 'Kecamatan Contoh',
    summary: 'Ringkasan program uji coba sistem.',
    description: 'Deskripsi program uji coba sistem untuk validasi filter tipe PROGRAM.',
    beneficiaries: 0,
    status: 'PUBLISHED',
    featured: false,
    cover_image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '20000000-0000-0000-0000-000000000003',
    title: '[DUMMY] DRAFT Rekam Kerja Internal (Tidak Publik)',
    slug: 'draft-rekam-kerja-internal',
    type: 'REKAM_KERJA',
    category_id: '10000000-0000-0000-0000-000000000002',
    date: '2026-03-01',
    location: 'Kantor',
    regency: 'Kabupaten Contoh',
    district: 'Kecamatan Contoh',
    summary: 'Data berstatus DRAFT untuk menguji RLS dan pemisahan data privat.',
    description: 'Konten ini tidak boleh tampil di endpoint publik.',
    beneficiaries: 0,
    status: 'DRAFT',
    featured: false,
    cover_image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export interface GetActivitiesOptions {
  type?: ActivityType;
  featuredOnly?: boolean;
  limit?: number;
}

/**
 * Public query: strictly retrieves only PUBLISHED activities.
 */
export async function getPublishedActivities(
  options: GetActivitiesOptions = {}
): Promise<Activity[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase
      .from('activities')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('date', { ascending: false });

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
    return result.data as Activity[];
  }

  // Filter fallback: strictly exclude non-published
  return FALLBACK_ACTIVITIES.filter((a) => {
    if (a.status !== 'PUBLISHED') return false;
    if (options.type && a.type !== options.type) return false;
    if (options.featuredOnly && !a.featured) return false;
    return true;
  }).slice(0, options.limit || FALLBACK_ACTIVITIES.length);
}

/**
 * Public query: strictly retrieves a single PUBLISHED activity by slug.
 */
export async function getActivityBySlug(slug: string): Promise<Activity | null> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('activities')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as Activity;
  }

  const found = FALLBACK_ACTIVITIES.find(
    (a) => a.slug === slug && a.status === 'PUBLISHED'
  );
  return found || null;
}

/**
 * Admin query: retrieves activities across all statuses.
 */
export async function getAllActivitiesForAdmin(): Promise<Activity[]> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
  });

  if (result.data && !result.error) {
    return result.data as Activity[];
  }

  return FALLBACK_ACTIVITIES;
}
