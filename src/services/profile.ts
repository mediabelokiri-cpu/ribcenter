import { executeServerQuery } from '@/services/supabase';
import type { Profile, TimelineItem, Organization } from '@/types/database';

// In-memory store for development/testing fallback
let memoryProfile: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Rahmat Ichwan Bahtiar',
  display_name: 'Rahmat Ichwan Bahtiar',
  title: 'Tokoh Publik & Pelayan Masyarakat',
  photo_url: null,
  biography:
    'Rahmat Ichwan Bahtiar mendedikasikan perjalanan kariernya untuk pengabdian publik, transparansi kebijakan, dan akuntabilitas kepemimpinan demi kemaslahatan masyarakat luas.',
  education: [
    {
      institution: 'Universitas Indonesia',
      degree: 'Sarjana',
      field: 'Ilmu Sosial & Politik',
      year: '2010',
    },
    {
      institution: 'Institut Manajemen Publik',
      degree: 'Magister',
      field: 'Kebijakan Publik',
      year: '2015',
    },
  ],
  vision: 'Mewujudkan tata kelola kepemimpinan yang berintegritas, transparan, dan berkeadilan sosial.',
  mission:
    'Menyediakan akses informasi publik terbuka, memperjuangkan aspirasi rakyat secara konsisten, serta menyajikan rekam kerja yang akuntabel dan terverifikasi.',
  social_links: {
    instagram: 'https://instagram.com',
    facebook: 'https://facebook.com',
  },
  is_published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

let memoryTimeline: TimelineItem[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    year_start: 2024,
    year_end: null,
    title: 'Amanah Pelayanan Publik Berkelanjutan',
    description: 'Menjalankan fungsi pengawasan, legislasi, dan penyerapan aspirasi secara konsisten.',
    category: 'POLITIK',
    image_url: null,
    order_index: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    year_start: 2019,
    year_end: 2024,
    title: 'Periode Awal Pengabdian Legislatif',
    description: 'Aktif mengawal program pembangunan daerah dan kesejahteraan konstituen.',
    category: 'POLITIK',
    image_url: null,
    order_index: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    year_start: 2015,
    year_end: 2018,
    title: 'Penguatan Advokasi Sosial & Kebijakan',
    description: 'Memimpin inisiatif advokasi masyarakat sipil di tingkat wilayah.',
    category: 'ORGANISASI',
    image_url: null,
    order_index: 3,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let memoryOrganizations: Organization[] = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    organization_name: 'Dewan Pimpinan Daerah',
    role: 'Ketua / Pengurus Inti',
    description: 'Memimpin koordinasi dan arah strategis organisasi di tingkat daerah.',
    period_start: '2020',
    period_end: 'Sekarang',
    logo_url: null,
    order_index: 1,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    organization_name: 'Himpunan Pemberdayaan Masyarakat',
    role: 'Koordinator Advokasi Wilayah',
    description: 'Menggerakkan program pelatihan dan pendampingan ekonomi warga.',
    period_start: '2016',
    period_end: '2020',
    logo_url: null,
    order_index: 2,
    is_published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ----------------------------------------------------------------------------
// PROFILE METHODS
// ----------------------------------------------------------------------------

export async function getProfile(): Promise<Profile | null> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('profile')
      .select('*')
      .eq('is_published', true)
      .limit(1)
      .maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as Profile;
  }

  return memoryProfile;
}

export async function getProfileForAdmin(): Promise<Profile> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('profile')
      .select('*')
      .limit(1)
      .maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as Profile;
  }

  return memoryProfile;
}

export async function updateProfile(
  data: Partial<Profile>
): Promise<{ success: boolean; data?: Profile; error?: string }> {
  const result = await executeServerQuery(async (supabase) => {
    const existing = await supabase.from('profile').select('id').limit(1).maybeSingle();
    if (existing.data?.id) {
      return supabase
        .from('profile')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', existing.data.id)
        .select()
        .single();
    } else {
      return supabase
        .from('profile')
        .insert({
          name: data.name || 'Rahmat Ichwan Bahtiar',
          display_name: data.display_name || 'Rahmat Ichwan Bahtiar',
          title: data.title || '',
          biography: data.biography || '',
          vision: data.vision || '',
          mission: data.mission || '',
          education: data.education || [],
          social_links: data.social_links || {},
          photo_url: data.photo_url || null,
          is_published: data.is_published ?? true,
        })
        .select()
        .single();
    }
  });

  if (result.data && !result.error) {
    return { success: true, data: result.data as Profile };
  }

  // Update memory fallback
  memoryProfile = {
    ...memoryProfile,
    ...data,
    updated_at: new Date().toISOString(),
  };

  return { success: true, data: memoryProfile };
}

// ----------------------------------------------------------------------------
// TIMELINE METHODS
// ----------------------------------------------------------------------------

export async function getTimeline(isPublicOnly = true): Promise<TimelineItem[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase.from('timeline').select('*');
    if (isPublicOnly) {
      query = query.eq('is_published', true);
    }
    return query
      .order('year_start', { ascending: false })
      .order('order_index', { ascending: true });
  });

  if (result.data && !result.error) {
    return result.data as TimelineItem[];
  }

  return memoryTimeline
    .filter((t) => (!isPublicOnly || t.is_published))
    .sort((a, b) => b.year_start - a.year_start || a.order_index - b.order_index);
}

export async function createTimelineItem(
  item: Omit<TimelineItem, 'id' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; data?: TimelineItem; error?: string }> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('timeline').insert(item).select().single();
  });

  if (result.data && !result.error) {
    return { success: true, data: result.data as TimelineItem };
  }

  const newItem: TimelineItem = {
    ...item,
    id: `tl-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  memoryTimeline.push(newItem);

  return { success: true, data: newItem };
}

export async function updateTimelineItem(
  id: string,
  data: Partial<TimelineItem>
): Promise<{ success: boolean; data?: TimelineItem; error?: string }> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('timeline')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  });

  if (result.data && !result.error) {
    return { success: true, data: result.data as TimelineItem };
  }

  const idx = memoryTimeline.findIndex((t) => t.id === id);
  if (idx !== -1) {
    memoryTimeline[idx] = {
      ...memoryTimeline[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return { success: true, data: memoryTimeline[idx] };
  }

  return { success: false, error: 'Linimasa tidak ditemukan.' };
}

export async function deleteTimelineItem(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('timeline').delete().eq('id', id);
  });

  if (!result.error && !result.isFallback) {
    return { success: true };
  }

  memoryTimeline = memoryTimeline.filter((t) => t.id !== id);
  return { success: true };
}

// ----------------------------------------------------------------------------
// ORGANIZATION METHODS
// ----------------------------------------------------------------------------

export async function getOrganizations(isPublicOnly = true): Promise<Organization[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase.from('organizations').select('*');
    if (isPublicOnly) {
      query = query.eq('is_published', true);
    }
    return query.order('order_index', { ascending: true });
  });

  if (result.data && !result.error) {
    return result.data as Organization[];
  }

  return memoryOrganizations
    .filter((o) => (!isPublicOnly || o.is_published))
    .sort((a, b) => a.order_index - b.order_index);
}

export async function createOrganization(
  item: Omit<Organization, 'id' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; data?: Organization; error?: string }> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('organizations').insert(item).select().single();
  });

  if (result.data && !result.error) {
    return { success: true, data: result.data as Organization };
  }

  const newItem: Organization = {
    ...item,
    id: `org-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  memoryOrganizations.push(newItem);

  return { success: true, data: newItem };
}

export async function updateOrganization(
  id: string,
  data: Partial<Organization>
): Promise<{ success: boolean; data?: Organization; error?: string }> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('organizations')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  });

  if (result.data && !result.error) {
    return { success: true, data: result.data as Organization };
  }

  const idx = memoryOrganizations.findIndex((o) => o.id === id);
  if (idx !== -1) {
    memoryOrganizations[idx] = {
      ...memoryOrganizations[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return { success: true, data: memoryOrganizations[idx] };
  }

  return { success: false, error: 'Organisasi tidak ditemukan.' };
}

export async function deleteOrganization(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('organizations').delete().eq('id', id);
  });

  if (!result.error && !result.isFallback) {
    return { success: true };
  }

  memoryOrganizations = memoryOrganizations.filter((o) => o.id !== id);
  return { success: true };
}
