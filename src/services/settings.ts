import { executeServerQuery } from '@/services/supabase';
import type { SiteSetting } from '@/types/database';

const FALLBACK_SETTINGS: SiteSetting[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    key: 'general',
    value: {
      site_name: 'Rahmat Ichwan Bahtiar',
      site_tagline: 'Platform Informasi & Akuntabilitas Publik',
      description: 'Platform resmi informasi rekam kerja dan akuntabilitas publik.',
    },
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    key: 'contact',
    value: {
      email: 'kontak.test@example.com',
      whatsapp: '080000000000',
      address: 'Indonesia (Data Uji Coba)',
    },
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getSiteSettings(isPublicOnly = true): Promise<SiteSetting[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase.from('site_settings').select('*');
    if (isPublicOnly) {
      query = query.eq('is_public', true);
    }
    return query;
  });

  if (result.data && !result.error) {
    return result.data as SiteSetting[];
  }

  return FALLBACK_SETTINGS;
}

export async function getSiteSettingByKey(key: string): Promise<SiteSetting | null> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('site_settings').select('*').eq('key', key).maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as SiteSetting;
  }

  return FALLBACK_SETTINGS.find((s) => s.key === key) || null;
}
