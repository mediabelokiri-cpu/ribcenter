import { executeServerQuery } from '@/services/supabase';
import type {
  Activity,
  ActivityCategory,
  ActivityType,
  ContentStatus,
  Database,
} from '@/types/database';

type ActivityInsert = Database['public']['Tables']['activities']['Insert'];
type ActivityUpdate = Database['public']['Tables']['activities']['Update'];
type ActivityCategoryInsert = Database['public']['Tables']['activity_categories']['Insert'];
type ActivityCategoryUpdate = Database['public']['Tables']['activity_categories']['Update'];

export type ActivityWithCategory = Activity & {
  category?: ActivityCategory | null;
};

// ---------------------------------------------------------------------------
// FALLBACK DATA (For local development or when Supabase is not connected)
// ---------------------------------------------------------------------------

let FALLBACK_CATEGORIES: ActivityCategory[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    name: 'Pertanian & Perkebunan',
    slug: 'pertanian-perkebunan',
    description: 'Program dan advokasi kelompok tani, bibit, dan sarana pertanian rakyat.',
    order_index: 1,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    name: 'Pendidikan & Beasiswa',
    slug: 'pendidikan-beasiswa',
    description: 'Fasilitasi beasiswa, sarana prasarana sekolah, dan pelatihan pemuda.',
    order_index: 2,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    name: 'Advokasi Sosial & Kebijakan',
    slug: 'advokasi-sosial',
    description: 'Pendampingan masyarakat rentan, aspirasi publik, dan pengawasan kebijakan.',
    order_index: 3,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    name: 'Infrastruktur Wilayah',
    slug: 'infrastruktur-wilayah',
    description: 'Pembangunan jalan desa, jembatan tani, dan sarana air bersih.',
    order_index: 4,
    is_active: true,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  },
];

let FALLBACK_ACTIVITIES: Activity[] = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    title: 'Penyaluran Bantuan Bibit Kakao Unggul Kelompok Tani',
    slug: 'penyaluran-bantuan-bibit-kakao-unggul-kelompok-tani',
    type: 'PROGRAM',
    category_id: '10000000-0000-0000-0000-000000000001',
    date: '2026-02-15',
    location: 'Kecamatan Tinambung',
    regency: 'Polewali Mandar',
    district: 'Tinambung',
    summary: 'Fasilitasi penyaluran 15.000 bibit kakao tahan hama untuk 8 gabungan kelompok tani.',
    description: 'Melalui program penguatan komoditas perkebunan rakyat, Rahmat Ichwan Bahtiar memfasilitasi koordinasi penyaluran bibit kakao unggul bersertifikasi kepada kelompok tani di wilayah Tinambung guna meningkatkan produktivitas perkebunan rakyat yang sempat terdampak penurunan mutu tanaman tua.',
    beneficiaries: 240,
    status: 'PUBLISHED',
    featured: true,
    cover_image_url: null,
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    created_at: '2026-02-15T08:00:00Z',
    updated_at: '2026-02-15T08:00:00Z',
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    title: 'Kunjungan Reses Masa Sidang I: Penjaringan Aspirasi Warga Pesisir',
    slug: 'kunjungan-reses-penjaringan-aspirasi-warga-pesisir',
    type: 'RESES',
    category_id: '10000000-0000-0000-0000-000000000003',
    date: '2026-01-20',
    location: 'Kelurahan Banggae',
    regency: 'Majene',
    district: 'Banggae',
    summary: 'Pertemuan tatap muka bersama nelayan dan pelaku UMKM pesisir menyerap 12 butir usulan prioritas.',
    description: 'Kegiatan reses masa sidang I difokuskan pada dialog langsung dengan masyarakat nelayan Majene mengenai perizinan kapal kecil, kestabilan harga solar subsidi nelayan, serta bantuan perbaikan fasilitas tambat labuh perahu.',
    beneficiaries: 180,
    status: 'PUBLISHED',
    featured: true,
    cover_image_url: null,
    video_url: null,
    created_at: '2026-01-20T09:00:00Z',
    updated_at: '2026-01-20T09:00:00Z',
  },
  {
    id: '20000000-0000-0000-0000-000000000003',
    title: 'Advokasi Perbaikan Jembatan Penghubung Desa Tertinggal',
    slug: 'advokasi-perbaikan-jembatan-penghubung-desa-tertinggal',
    type: 'REKAM_KERJA',
    category_id: '10000000-0000-0000-0000-000000000004',
    date: '2025-11-10',
    location: 'Desa Salugatta',
    regency: 'Mamuju Tengah',
    district: 'Budong-Budong',
    summary: 'Pengawalan alokasi anggaran rekonstruksi jembatan penghubung dua sentra produksi pertanian.',
    description: 'Setelah bertahun-tahun mengalami kerusakan akibat luapan air sungai, aspirasi perbaikan jembatan gantung diperjuangkan dalam rapat kerja pengawasan anggaran infrastruktur agar masuk prioritas penanganan darurat dinas terkait.',
    beneficiaries: 850,
    status: 'PUBLISHED',
    featured: false,
    cover_image_url: null,
    video_url: null,
    created_at: '2025-11-10T10:00:00Z',
    updated_at: '2025-11-10T10:00:00Z',
  },
  {
    id: '20000000-0000-0000-0000-000000000004',
    title: 'Pelatihan Literasi Digital & Wirausaha Muda Daerah',
    slug: 'pelatihan-literasi-digital-wirausaha-muda-daerah',
    type: 'KEGIATAN',
    category_id: '10000000-0000-0000-0000-000000000002',
    date: '2025-09-05',
    location: 'Pusat Kreativitas Pemuda',
    regency: 'Mamuju',
    district: 'Simboro',
    summary: 'Workshop intensif pemasaran digital dan pembukuan praktis bagi 60 wirausahawan pemula.',
    description: 'Inisiatif pemberdayaan generasi muda dalam memanfaatkan platform e-commerce dan pencatatan keuangan modern guna memperluas jangkauan pasar produk lokal daerah.',
    beneficiaries: 60,
    status: 'PUBLISHED',
    featured: false,
    cover_image_url: null,
    video_url: null,
    created_at: '2025-09-05T08:00:00Z',
    updated_at: '2025-09-05T08:00:00Z',
  },
  {
    id: '20000000-0000-0000-0000-000000000005',
    title: '[DRAFT] Rencana Program Beasiswa Mahasiswa Kurang Mampu',
    slug: 'draft-rencana-program-beasiswa-mahasiswa-kurang-mampu',
    type: 'PROGRAM',
    category_id: '10000000-0000-0000-0000-000000000002',
    date: '2026-03-01',
    location: 'Mamuju',
    regency: 'Mamuju',
    district: 'Mamuju',
    summary: 'Draft usulan skema bantuan pendidikan dan penjaringan syarat penerima manfaat.',
    description: 'Dokumen perencanaan internal untuk verifikasi kuota beasiswa daerah. Belum berstatus publikasi.',
    beneficiaries: 0,
    status: 'DRAFT',
    featured: false,
    cover_image_url: null,
    video_url: null,
    created_at: '2026-03-01T00:00:00Z',
    updated_at: '2026-03-01T00:00:00Z',
  },
];

// ---------------------------------------------------------------------------
// 1. ACTIVITY CATEGORIES MANAGEMENT
// ---------------------------------------------------------------------------

export async function getActivityCategories(
  options: { activeOnly?: boolean } = {}
): Promise<ActivityCategory[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase
      .from('activity_categories')
      .select('*')
      .order('order_index', { ascending: true })
      .order('name', { ascending: true });

    if (options.activeOnly) {
      query = query.eq('is_active', true);
    }
    return query;
  });

  if (result.data && !result.error) {
    return result.data as ActivityCategory[];
  }

  let list = [...FALLBACK_CATEGORIES];
  if (options.activeOnly) {
    list = list.filter((c) => c.is_active);
  }
  return list.sort((a, b) => a.order_index - b.order_index);
}

export async function getActivityCategoryById(
  id: string
): Promise<ActivityCategory | null> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('activity_categories')
      .select('*')
      .eq('id', id)
      .maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as ActivityCategory;
  }

  return FALLBACK_CATEGORIES.find((c) => c.id === id) || null;
}

export async function createActivityCategory(
  data: ActivityCategoryInsert
): Promise<ActivityCategory> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('activity_categories')
      .insert(data)
      .select('*')
      .single();
  });

  if (result.data && !result.error) {
    return result.data as ActivityCategory;
  }

  const newCat: ActivityCategory = {
    id: data.id || `cat-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: data.name,
    slug: data.slug,
    description: data.description || null,
    order_index: data.order_index ?? FALLBACK_CATEGORIES.length + 1,
    is_active: data.is_active ?? true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  FALLBACK_CATEGORIES.push(newCat);
  return newCat;
}

export async function updateActivityCategory(
  id: string,
  data: ActivityCategoryUpdate
): Promise<ActivityCategory> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('activity_categories')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
  });

  if (result.data && !result.error) {
    return result.data as ActivityCategory;
  }

  const idx = FALLBACK_CATEGORIES.findIndex((c) => c.id === id);
  if (idx === -1) {
    throw new Error(`Category with ID ${id} not found`);
  }

  const updated: ActivityCategory = {
    ...FALLBACK_CATEGORIES[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  FALLBACK_CATEGORIES[idx] = updated;
  return updated;
}

export async function deleteActivityCategory(id: string): Promise<boolean> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('activity_categories')
      .delete()
      .eq('id', id);
  });

  if (!result.error) {
    FALLBACK_CATEGORIES = FALLBACK_CATEGORIES.filter((c) => c.id !== id);
    return true;
  }

  FALLBACK_CATEGORIES = FALLBACK_CATEGORIES.filter((c) => c.id !== id);
  return true;
}

// ---------------------------------------------------------------------------
// 2. REKAM KERJA / ACTIVITIES PUBLIC QUERIES
// ---------------------------------------------------------------------------

export interface GetActivitiesOptions {
  type?: ActivityType;
  categoryId?: string;
  categorySlug?: string;
  regency?: string;
  district?: string;
  year?: number;
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Public query: strictly retrieves only PUBLISHED activities, supporting multi-dimensional filters.
 */
export async function getPublishedActivities(
  options: GetActivitiesOptions = {}
): Promise<ActivityWithCategory[]> {
  const categories = await getActivityCategories();
  const catMap = new Map(categories.map((c) => [c.id, c]));

  let resolvedCategoryId = options.categoryId;
  if (!resolvedCategoryId && options.categorySlug) {
    const foundCat = categories.find((c) => c.slug === options.categorySlug);
    if (foundCat) resolvedCategoryId = foundCat.id;
  }

  const result = await executeServerQuery(async (supabase) => {
    let query = supabase
      .from('activities')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('date', { ascending: false });

    if (options.type) {
      query = query.eq('type', options.type);
    }
    if (resolvedCategoryId) {
      query = query.eq('category_id', resolvedCategoryId);
    }
    if (options.regency) {
      query = query.eq('regency', options.regency);
    }
    if (options.district) {
      query = query.eq('district', options.district);
    }
    if (options.year) {
      query = query
        .gte('date', `${options.year}-01-01`)
        .lte('date', `${options.year}-12-31`);
    }
    if (options.featuredOnly) {
      query = query.eq('featured', true);
    }
    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    return query;
  });

  if (result.data && !result.error) {
    return (result.data as Activity[]).map((act) => ({
      ...act,
      category: act.category_id ? catMap.get(act.category_id) || null : null,
    }));
  }

  // Fallback filtering in memory
  let filtered = FALLBACK_ACTIVITIES.filter((a) => {
    if (a.status !== 'PUBLISHED') return false;
    if (options.type && a.type !== options.type) return false;
    if (resolvedCategoryId && a.category_id !== resolvedCategoryId) return false;
    if (options.regency && a.regency !== options.regency) return false;
    if (options.district && a.district !== options.district) return false;
    if (options.year) {
      const itemYear = new Date(a.date).getFullYear();
      if (itemYear !== options.year) return false;
    }
    if (options.featuredOnly && !a.featured) return false;
    return true;
  });

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (options.offset) {
    filtered = filtered.slice(options.offset);
  }
  if (options.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered.map((act) => ({
    ...act,
    category: act.category_id ? catMap.get(act.category_id) || null : null,
  }));
}

/**
 * Public query: strictly retrieves a single PUBLISHED activity by slug with its category info.
 */
export async function getActivityBySlug(
  slug: string
): Promise<ActivityWithCategory | null> {
  const categories = await getActivityCategories();
  const catMap = new Map(categories.map((c) => [c.id, c]));

  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('activities')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .maybeSingle();
  });

  if (result.data && !result.error) {
    const act = result.data as Activity;
    return {
      ...act,
      category: act.category_id ? catMap.get(act.category_id) || null : null,
    };
  }

  const found = FALLBACK_ACTIVITIES.find(
    (a) => a.slug === slug && a.status === 'PUBLISHED'
  );
  if (!found) return null;

  return {
    ...found,
    category: found.category_id ? catMap.get(found.category_id) || null : null,
  };
}

/**
 * Helper: get distinct regencies among published activities.
 */
export async function getDistinctRegencies(): Promise<string[]> {
  const activities = await getPublishedActivities();
  const regencies = new Set<string>();
  activities.forEach((a) => {
    if (a.regency && a.regency.trim()) regencies.add(a.regency.trim());
  });
  return Array.from(regencies).sort();
}

/**
 * Helper: get distinct years among published activities.
 */
export async function getDistinctYears(): Promise<number[]> {
  const activities = await getPublishedActivities();
  const years = new Set<number>();
  activities.forEach((a) => {
    if (a.date) {
      const yr = new Date(a.date).getFullYear();
      if (!isNaN(yr)) years.add(yr);
    }
  });
  return Array.from(years).sort((a, b) => b - a);
}

// ---------------------------------------------------------------------------
// 3. REKAM KERJA / ACTIVITIES ADMIN CRUD
// ---------------------------------------------------------------------------

export interface AdminActivitiesFilter {
  search?: string;
  type?: ActivityType;
  status?: ContentStatus;
  categoryId?: string;
}

/**
 * Admin query: retrieves activities across all statuses with filtering support.
 */
export async function getAllActivitiesForAdmin(
  filters: AdminActivitiesFilter = {}
): Promise<ActivityWithCategory[]> {
  const categories = await getActivityCategories();
  const catMap = new Map(categories.map((c) => [c.id, c]));

  const result = await executeServerQuery(async (supabase) => {
    let query = supabase
      .from('activities')
      .select('*')
      .order('date', { ascending: false });

    if (filters.type) {
      query = query.eq('type', filters.type);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }
    if (filters.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }
    if (filters.search && filters.search.trim()) {
      const term = `%${filters.search.trim()}%`;
      query = query.or(`title.ilike.${term},summary.ilike.${term},location.ilike.${term},regency.ilike.${term}`);
    }

    return query;
  });

  if (result.data && !result.error) {
    return (result.data as Activity[]).map((act) => ({
      ...act,
      category: act.category_id ? catMap.get(act.category_id) || null : null,
    }));
  }

  let list = [...FALLBACK_ACTIVITIES];
  if (filters.type) {
    list = list.filter((a) => a.type === filters.type);
  }
  if (filters.status) {
    list = list.filter((a) => a.status === filters.status);
  }
  if (filters.categoryId) {
    list = list.filter((a) => a.category_id === filters.categoryId);
  }
  if (filters.search && filters.search.trim()) {
    const s = filters.search.toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(s) ||
        (a.summary && a.summary.toLowerCase().includes(s)) ||
        (a.location && a.location.toLowerCase().includes(s)) ||
        (a.regency && a.regency.toLowerCase().includes(s))
    );
  }

  list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return list.map((act) => ({
    ...act,
    category: act.category_id ? catMap.get(act.category_id) || null : null,
  }));
}

/**
 * Admin query: retrieves a single activity by ID regardless of status.
 */
export async function getActivityByIdForAdmin(
  id: string
): Promise<Activity | null> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('activities')
      .select('*')
      .eq('id', id)
      .maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as Activity;
  }

  return FALLBACK_ACTIVITIES.find((a) => a.id === id) || null;
}

/**
 * Admin mutation: create a new activity record.
 */
export async function createActivity(
  data: ActivityInsert
): Promise<Activity> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('activities')
      .insert(data)
      .select('*')
      .single();
  });

  if (result.data && !result.error) {
    return result.data as Activity;
  }

  // Ensure unique slug in fallback
  let finalSlug = data.slug;
  let counter = 1;
  while (FALLBACK_ACTIVITIES.some((a) => a.slug === finalSlug)) {
    counter++;
    finalSlug = `${data.slug}-${counter}`;
  }

  const newActivity: Activity = {
    id: data.id || `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: data.title,
    slug: finalSlug,
    type: data.type,
    category_id: data.category_id || null,
    date: data.date,
    location: data.location || null,
    regency: data.regency || null,
    district: data.district || null,
    summary: data.summary || null,
    description: data.description,
    beneficiaries: data.beneficiaries ?? 0,
    status: data.status || 'PUBLISHED',
    featured: data.featured ?? false,
    cover_image_url: data.cover_image_url || null,
    video_url: data.video_url || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  FALLBACK_ACTIVITIES.unshift(newActivity);
  return newActivity;
}

/**
 * Admin mutation: update an existing activity record.
 */
export async function updateActivity(
  id: string,
  data: ActivityUpdate
): Promise<Activity> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('activities')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select('*')
      .single();
  });

  if (result.data && !result.error) {
    return result.data as Activity;
  }

  const idx = FALLBACK_ACTIVITIES.findIndex((a) => a.id === id);
  if (idx === -1) {
    throw new Error(`Activity with ID ${id} not found`);
  }

  const updated: Activity = {
    ...FALLBACK_ACTIVITIES[idx],
    ...data,
    updated_at: new Date().toISOString(),
  };
  FALLBACK_ACTIVITIES[idx] = updated;
  return updated;
}

/**
 * Admin mutation: delete an activity record.
 */
export async function deleteActivity(id: string): Promise<boolean> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('activities')
      .delete()
      .eq('id', id);
  });

  if (!result.error) {
    FALLBACK_ACTIVITIES = FALLBACK_ACTIVITIES.filter((a) => a.id !== id);
    return true;
  }

  FALLBACK_ACTIVITIES = FALLBACK_ACTIVITIES.filter((a) => a.id !== id);
  return true;
}
