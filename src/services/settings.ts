import { executeServerQuery } from '@/services/supabase';
import type { SiteSetting, Json } from '@/types/database';

export interface ContactSettings {
  email: string;
  whatsapp: string;
  address: string;
  office_hours?: string;
  map_embed_url?: string;
}

export interface SocialSettings {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  youtube?: string;
  twitter?: string;
}

export interface GeneralSettings {
  site_name: string;
  site_tagline: string;
  description: string;
}

// ----------------------------------------------------------------------------
// IN-MEMORY FALLBACK STORE (For offline development & automated tests)
// ----------------------------------------------------------------------------

const memorySettings: SiteSetting[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    key: 'general',
    value: {
      site_name: 'RIB CENTER',
      site_tagline: 'Platform Informasi & Akuntabilitas Publik Rahmat Ichwan Bahtiar',
      description:
        'Platform resmi transparansi rekam kerja, publikasi gagasan, dan saluran aspirasi masyarakat Rahmat Ichwan Bahtiar.',
    },
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    key: 'contact',
    value: {
      email: 'kontak@kawanrib.id',
      whatsapp: '081155667788',
      address: 'Jl. Pahlawan No. 45, Samarinda, Kalimantan Timur 75123',
      office_hours: 'Senin – Jumat: 08.30 – 17.00 WITA',
      map_embed_url: '',
    },
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    key: 'social',
    value: {
      instagram: 'https://instagram.com/rahmatichwanbahtiar',
      facebook: 'https://facebook.com/kawan.rahmatichwanbahtiar',
      tiktok: 'https://tiktok.com/@rahmatichwanbahtiar',
      youtube: 'https://youtube.com/@kawanrib',
      twitter: 'https://x.com/kawanrib',
    },
    is_public: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Retrieves all site settings, optionally filtered by public availability.
 */
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

  return isPublicOnly ? memorySettings.filter((s) => s.is_public) : memorySettings;
}

/**
 * Retrieves a single setting by key.
 */
export async function getSiteSettingByKey(key: string): Promise<SiteSetting | null> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('site_settings').select('*').eq('key', key).maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as SiteSetting;
  }

  return memorySettings.find((s) => s.key === key) || null;
}

/**
 * Updates or creates a site setting by key.
 * Only callable by authorized Admins.
 */
export async function updateSiteSettingByKey(
  key: string,
  value: Json,
  isPublic = true
): Promise<{ success: boolean; data?: SiteSetting; error?: string }> {
  const now = new Date().toISOString();

  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('site_settings')
      .upsert(
        {
          key,
          value,
          is_public: isPublic,
          updated_at: now,
        },
        { onConflict: 'key' }
      )
      .select()
      .single();
  });

  if (result.data && !result.error) {
    return { success: true, data: result.data as SiteSetting };
  }

  // Update in memory fallback
  const idx = memorySettings.findIndex((s) => s.key === key);
  if (idx !== -1) {
    memorySettings[idx] = {
      ...memorySettings[idx],
      value,
      is_public: isPublic,
      updated_at: now,
    };
    return { success: true, data: memorySettings[idx] };
  }

  const newSetting: SiteSetting = {
    id: `00000000-0000-0000-0000-${Date.now().toString().slice(-12)}`,
    key,
    value,
    is_public: isPublic,
    created_at: now,
    updated_at: now,
  };
  memorySettings.push(newSetting);
  return { success: true, data: newSetting };
}

/**
 * Helper: Retrieves structured contact settings.
 */
export async function getContactSettings(): Promise<ContactSettings> {
  const setting = await getSiteSettingByKey('contact');
  const val = (setting?.value as Record<string, unknown>) || {};

  return {
    email: (val.email as string) || 'kontak@kawanrib.id',
    whatsapp: (val.whatsapp as string) || '081155667788',
    address:
      (val.address as string) ||
      'Jl. Pahlawan No. 45, Samarinda, Kalimantan Timur 75123',
    office_hours: (val.office_hours as string) || 'Senin – Jumat: 08.30 – 17.00 WITA',
    map_embed_url: (val.map_embed_url as string) || '',
  };
}

/**
 * Helper: Retrieves structured social media settings.
 */
export async function getSocialSettings(): Promise<SocialSettings> {
  const setting = await getSiteSettingByKey('social');
  const val = (setting?.value as Record<string, unknown>) || {};

  return {
    instagram: (val.instagram as string) || '',
    facebook: (val.facebook as string) || '',
    tiktok: (val.tiktok as string) || '',
    youtube: (val.youtube as string) || '',
    twitter: (val.twitter as string) || '',
  };
}

/**
 * Helper: Retrieves structured general site settings.
 */
export async function getGeneralSettings(): Promise<GeneralSettings> {
  const setting = await getSiteSettingByKey('general');
  const val = (setting?.value as Record<string, unknown>) || {};

  return {
    site_name: (val.site_name as string) || 'RIB CENTER',
    site_tagline:
      (val.site_tagline as string) ||
      'Platform Informasi & Akuntabilitas Publik Rahmat Ichwan Bahtiar',
    description:
      (val.description as string) ||
      'Platform resmi transparansi rekam kerja, publikasi gagasan, dan saluran aspirasi masyarakat Rahmat Ichwan Bahtiar.',
  };
}

/**
 * Formats an Indonesian/international phone number into a direct WhatsApp click-to-chat URL.
 * Example: '081155667788' -> 'https://wa.me/6281155667788?text=Halo%20Admin%20RIB%20CENTER'
 */
export function formatWhatsAppUrl(rawPhone: string, message = 'Halo Admin RIB CENTER, saya ingin menyampaikan pesan koordinasi.'): string {
  if (!rawPhone) return '';

  // Clean non-digits
  let cleanDigits = rawPhone.replace(/\D/g, '');

  // Convert leading 0 to Indonesian country code 62
  if (cleanDigits.startsWith('0')) {
    cleanDigits = '62' + cleanDigits.slice(1);
  } else if (!cleanDigits.startsWith('62') && cleanDigits.length > 0) {
    cleanDigits = '62' + cleanDigits;
  }

  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanDigits}?text=${encodedMsg}`;
}
