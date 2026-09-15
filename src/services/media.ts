import { executeServerQuery } from '@/services/supabase';
import type { Album, MediaItem } from '@/types/database';

const FALLBACK_ALBUMS: Album[] = [
  {
    id: '40000000-0000-0000-0000-000000000001',
    title: '[DUMMY] Dokumentasi Kegiatan Uji Coba 2026',
    slug: 'dokumentasi-uji-coba-2026',
    description: 'Album dokumentasi foto dan video untuk pengujian sistem.',
    cover_image_url: 'https://placehold.co/800x600/png?text=Test+Cover',
    featured: true,
    order_index: 1,
    status: 'PUBLISHED',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export async function getPublishedAlbums(): Promise<Album[]> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('albums')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('order_index', { ascending: true });
  });

  if (result.data && !result.error) {
    return result.data as Album[];
  }

  return FALLBACK_ALBUMS;
}

export async function getMediaByAlbum(albumId: string): Promise<MediaItem[]> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('media')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false });
  });

  if (result.data && !result.error) {
    return result.data as MediaItem[];
  }

  return [];
}

export async function getAllAlbumsForAdmin(): Promise<Album[]> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('albums')
      .select('*')
      .order('created_at', { ascending: false });
  });

  if (result.data && !result.error) {
    return result.data as Album[];
  }

  return FALLBACK_ALBUMS;
}
