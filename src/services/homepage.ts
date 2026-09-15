import { executeServerQuery } from '@/services/supabase';
import type { HomepageSection } from '@/types/database';

const memorySections: HomepageSection[] = [
  {
    id: 'hs-1',
    section_key: 'hero',
    title: 'Hero Banner',
    is_active: true,
    order_index: 1,
    content: {
      headline: 'Platform Informasi & Akuntabilitas Publik',
      subheadline:
        'Keterbukaan rekam kerja, publikasi gagasan, dan saluran aspirasi masyarakat Rahmat Ichwan Bahtiar.',
      cta_primary_label: 'Lihat Profil & Rekam Jejak',
      cta_primary_link: '/tentang',
      cta_secondary_label: 'Sampaikan Aspirasi Warga',
      cta_secondary_link: '/aspirasi',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hs-2',
    section_key: 'profile_summary',
    title: 'Sekilas Profil',
    is_active: true,
    order_index: 2,
    content: {
      title: 'Mengenal Rahmat Ichwan Bahtiar',
      subtitle: 'Komitmen pelayanan berintegritas dan transparan.',
      cta_label: 'Pelajari Profil Lengkap',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hs-3',
    section_key: 'featured_activities',
    title: 'Highlight Rekam Kerja',
    is_active: true,
    order_index: 3,
    content: {
      title: 'Rekam Kerja & Pengabdian',
      subtitle: 'Program dan kegiatan advokasi kemasyarakatan.',
      display_count: 3,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hs-4',
    section_key: 'latest_articles',
    title: 'Kabar & Gagasan Terbaru',
    is_active: true,
    order_index: 4,
    content: {
      title: 'Kabar & Pemikiran Terkini',
      subtitle: 'Tulisan gagasan kebijakan dan liputan program.',
      display_count: 3,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hs-5',
    section_key: 'gallery_preview',
    title: 'Dokumentasi Kegiatan',
    is_active: true,
    order_index: 5,
    content: {
      title: 'Dokumentasi & Galeri',
      subtitle: 'Momen pengabdian dan interaksi bersama warga.',
      display_count: 4,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'hs-6',
    section_key: 'aspirations_cta',
    title: 'Saluran Aspirasi Warga',
    is_active: true,
    order_index: 6,
    content: {
      title: 'Suara & Aspirasi Anda',
      subtitle:
        'Sampaikan masukan, keluhan, dan harapan untuk kemajuan daerah secara langsung.',
      cta_label: 'Kirim Aspirasi Sekarang',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getHomepageSections(isPublicOnly = true): Promise<HomepageSection[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase.from('homepage_sections').select('*');
    if (isPublicOnly) {
      query = query.eq('is_active', true);
    }
    return query.order('order_index', { ascending: true });
  });

  if (result.data && !result.error) {
    return result.data as HomepageSection[];
  }

  return memorySections
    .filter((s) => (!isPublicOnly || s.is_active))
    .sort((a, b) => a.order_index - b.order_index);
}

export async function updateHomepageSection(
  id: string,
  data: Partial<HomepageSection>
): Promise<{ success: boolean; data?: HomepageSection; error?: string }> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('homepage_sections')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
  });

  if (result.data && !result.error) {
    return { success: true, data: result.data as HomepageSection };
  }

  const idx = memorySections.findIndex((s) => s.id === id);
  if (idx !== -1) {
    memorySections[idx] = {
      ...memorySections[idx],
      ...data,
      updated_at: new Date().toISOString(),
    };
    return { success: true, data: memorySections[idx] };
  }

  return { success: false, error: 'Section tidak ditemukan.' };
}

export async function reorderHomepageSections(
  orderedIds: string[]
): Promise<{ success: boolean; error?: string }> {
  const result = await executeServerQuery(async (supabase) => {
    // Update each order in Supabase
    const updates = orderedIds.map((id, index) =>
      supabase
        .from('homepage_sections')
        .update({ order_index: index + 1, updated_at: new Date().toISOString() })
        .eq('id', id)
    );
    await Promise.all(updates);
    return { data: true, error: null };
  });

  if (!result.error && !result.isFallback) {
    return { success: true };
  }

  orderedIds.forEach((id, index) => {
    const sec = memorySections.find((s) => s.id === id);
    if (sec) {
      sec.order_index = index + 1;
      sec.updated_at = new Date().toISOString();
    }
  });
  memorySections.sort((a, b) => a.order_index - b.order_index);

  return { success: true };
}
