import { executeServerQuery } from '@/services/supabase';
import type { Profile, TimelineItem, Organization } from '@/types/database';

const FALLBACK_PROFILE: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Rahmat Ichwan Bahtiar',
  display_name: 'Rahmat Ichwan Bahtiar',
  title: '[DUMMY] Tokoh Publik / Pelayan Masyarakat',
  photo_url: null,
  biography:
    '[DUMMY] Deskripsi profil pengembangan sistem. Digunakan untuk keperluan validasi teknis tata letak dan pengujian data.',
  education: [
    {
      institution: 'Universitas Contoh (Data Uji)',
      degree: 'Sarjana',
      field: 'Ilmu Sosial',
      year: '2010',
    },
  ],
  vision: '[DUMMY] Mewujudkan transparansi informasi publik dan akuntabilitas kerja.',
  mission:
    '[DUMMY] Menyediakan akses informasi terbuka, mendengar aspirasi rakyat secara langsung, dan menyajikan rekam kerja terverifikasi.',
  social_links: {},
  is_published: true,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

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

  return FALLBACK_PROFILE;
}

export async function getTimeline(isPublicOnly = true): Promise<TimelineItem[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase.from('timeline').select('*');
    if (isPublicOnly) {
      query = query.eq('is_published', true);
    }
    return query.order('year_start', { ascending: false }).order('order_index', { ascending: true });
  });

  if (result.data && !result.error) {
    return result.data as TimelineItem[];
  }

  return [];
}

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

  return [];
}
