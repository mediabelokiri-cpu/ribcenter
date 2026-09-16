import { executeServerQuery } from '@/services/supabase';
import { slugify, isValidSlug } from '@/lib/slug';
import { deleteMediaFile } from '@/services/storage';
import type { Album, MediaItem, MediaType, ContentStatus } from '@/types/database';

export interface VideoInfo {
  platform: 'youtube' | 'vimeo' | 'external';
  videoId?: string;
  embedUrl: string;
  thumbnailUrl: string;
}

/**
 * Parses an external video URL (YouTube, Vimeo, etc.) into clean embed and thumbnail URLs.
 */
export function parseVideoUrl(rawUrl: string): VideoInfo {
  const url = (rawUrl || '').trim();

  // 1. YouTube
  // Formats: youtube.com/watch?v=XYZ, youtu.be/XYZ, youtube.com/embed/XYZ, youtube.com/shorts/XYZ
  const ytMatch = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );

  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      platform: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
    };
  }

  // 2. Vimeo
  const vimeoMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      platform: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}`,
      thumbnailUrl: `https://vumbnail.com/${videoId}.jpg`,
    };
  }

  // 3. Generic external video URL
  return {
    platform: 'external',
    embedUrl: url,
    thumbnailUrl: '/file.svg',
  };
}

// ----------------------------------------------------------------------------
// IN-MEMORY FALLBACK STORE (For offline dev / testing)
// ----------------------------------------------------------------------------

let memoryAlbums: Album[] = [
  {
    id: '40000000-0000-0000-0000-000000000001',
    title: 'Peninjauan Lapangan Pembangunan Jembatan Desa',
    slug: 'peninjauan-lapangan-pembangunan-jembatan-desa',
    description: 'Dokumentasi visual kunjungan kerja peninjauan jembatan gantung penghubung antardesa.',
    cover_image_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=800&q=80',
    featured: true,
    order_index: 1,
    status: 'PUBLISHED',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '40000000-0000-0000-0000-000000000002',
    title: 'Musyawarah & Temu Wicara Bersama Warga Nelayan',
    slug: 'musyawarah-temu-wicara-warga-nelayan',
    description: 'Rangkaian dokumentasi serap aspirasi dan dialog langsung bersama kelompok nelayan pesisir.',
    cover_image_url: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=800&q=80',
    featured: true,
    order_index: 2,
    status: 'PUBLISHED',
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

let memoryMedia: MediaItem[] = [
  {
    id: '50000000-0000-0000-0000-000000000001',
    album_id: '40000000-0000-0000-0000-000000000001',
    file_url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=1200&q=80',
    media_type: 'IMAGE',
    title: 'Pemeriksaan Struktur Pilar Jembatan',
    alt_text: 'Rahmat meninjau pondasi jembatan',
    caption: 'Diskusi teknis dengan perwakilan dinas PU di lokasi konstruksi jembatan penghubung.',
    metadata: { width: 1200, height: 800, size: 245000, mime_type: 'image/jpeg' },
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '50000000-0000-0000-0000-000000000002',
    album_id: '40000000-0000-0000-0000-000000000001',
    file_url: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    media_type: 'IMAGE',
    title: 'Dialog Bersama Tokoh Masyarakat di Tapak Jembatan',
    alt_text: 'Pertemuan warga di dekat jembatan',
    caption: 'Mendengarkan aspirasi tokoh pemuda terkait kelancaran akses transportasi hasil panen.',
    metadata: { width: 1200, height: 800, size: 198000, mime_type: 'image/jpeg' },
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: '50000000-0000-0000-0000-000000000003',
    album_id: '40000000-0000-0000-0000-000000000002',
    file_url: 'https://images.unsplash.com/photo-1516214104703-d870798883c5?w=1200&q=80',
    media_type: 'IMAGE',
    title: 'Suasana Temu Wicara di Pangkalan Pendaratan Ikan',
    alt_text: 'Rahmat bertatap muka dengan nelayan',
    caption: 'Mendengarkan aspirasi terkait subsidi solar dan ketersediaan cold storage di pelabuhan.',
    metadata: { width: 1200, height: 800, size: 310000, mime_type: 'image/jpeg' },
    created_at: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: '50000000-0000-0000-0000-000000000004',
    album_id: null,
    file_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    media_type: 'VIDEO',
    title: 'Liputan Lapangan: Pengawalan Bantuan Alsintan Pertanian',
    alt_text: 'Video liputan pembagian alsintan',
    caption: 'Dokumentasi video penyerahan bantuan alat dan mesin pertanian langsung kepada kelompok tani.',
    metadata: {
      platform: 'youtube',
      videoId: 'dQw4w9WgXcQ',
      embed_url: 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
      thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    },
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

// ----------------------------------------------------------------------------
// ALBUM METHODS
// ----------------------------------------------------------------------------

export interface AlbumFilterOptions {
  search?: string;
  status?: ContentStatus | 'ALL';
  featuredOnly?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Public: Get published albums only.
 */
export async function getPublishedAlbums(limit?: number): Promise<Album[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase
      .from('albums')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }
    return query;
  });

  if (result.data && !result.error) {
    return result.data as Album[];
  }

  let list = memoryAlbums
    .filter((a) => a.status === 'PUBLISHED')
    .sort((a, b) => a.order_index - b.order_index || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (limit) {
    list = list.slice(0, limit);
  }
  return list;
}

/**
 * Public: Get a single published album by slug.
 * Returns null if not found or if status is DRAFT / ARCHIVED.
 */
export async function getAlbumBySlug(slug: string): Promise<Album | null> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('albums')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as Album;
  }

  const found = memoryAlbums.find((a) => a.slug === slug && a.status === 'PUBLISHED');
  return found || null;
}

/**
 * Admin: Get all albums with full status filtering.
 */
export async function getAllAlbumsForAdmin(options: AlbumFilterOptions = {}): Promise<Album[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase.from('albums').select('*');

    if (options.status && options.status !== 'ALL') {
      query = query.eq('status', options.status);
    }
    if (options.featuredOnly) {
      query = query.eq('featured', true);
    }
    if (options.search) {
      query = query.or(`title.ilike.%${options.search}%,description.ilike.%${options.search}%`);
    }

    query = query
      .order('order_index', { ascending: true })
      .order('created_at', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    return query;
  });

  if (result.data && !result.error) {
    return result.data as Album[];
  }

  let list = [...memoryAlbums];

  if (options.status && options.status !== 'ALL') {
    list = list.filter((a) => a.status === options.status);
  }
  if (options.featuredOnly) {
    list = list.filter((a) => a.featured);
  }
  if (options.search) {
    const s = options.search.toLowerCase();
    list = list.filter(
      (a) =>
        a.title.toLowerCase().includes(s) ||
        (a.description && a.description.toLowerCase().includes(s))
    );
  }

  list.sort((a, b) => a.order_index - b.order_index || new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (options.offset || options.limit) {
    const start = options.offset || 0;
    const end = options.limit ? start + options.limit : undefined;
    list = list.slice(start, end);
  }

  return list;
}

/**
 * Admin: Get a single album by ID.
 */
export async function getAlbumByIdForAdmin(id: string): Promise<Album | null> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('albums').select('*').eq('id', id).maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as Album;
  }

  return memoryAlbums.find((a) => a.id === id) || null;
}

/**
 * Validate whether a slug is available for an album.
 */
export async function isAlbumSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  if (!isValidSlug(slug)) return false;

  const result = await executeServerQuery(async (supabase) => {
    let query = supabase.from('albums').select('id').eq('slug', slug);
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    return query.maybeSingle();
  });

  if (result.data && !result.error) {
    return false;
  }

  const collision = memoryAlbums.find(
    (a) => a.slug === slug && (!excludeId || a.id !== excludeId)
  );
  return !collision;
}

/**
 * Create a new album.
 */
export async function createAlbum(
  data: Omit<Album, 'id' | 'created_at' | 'updated_at'>
): Promise<{ success: boolean; data?: Album; error?: string }> {
  let targetSlug = data.slug ? slugify(data.slug) : slugify(data.title);
  if (!targetSlug) {
    targetSlug = `album-${Date.now()}`;
  }

  const isAvailable = await isAlbumSlugAvailable(targetSlug);
  if (!isAvailable) {
    targetSlug = `${targetSlug}-${Date.now().toString(36).slice(-4)}`;
  }

  const payload = {
    ...data,
    slug: targetSlug,
    status: data.status || 'PUBLISHED',
    featured: Boolean(data.featured),
    order_index: typeof data.order_index === 'number' ? data.order_index : 0,
  };

  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('albums').insert(payload).select().single();
  });

  if (result.data && !result.error) {
    return { success: true, data: result.data as Album };
  }

  const newAlbum: Album = {
    ...payload,
    id: `alb-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  memoryAlbums.unshift(newAlbum);
  return { success: true, data: newAlbum };
}

/**
 * Update an existing album.
 */
export async function updateAlbum(
  id: string,
  data: Partial<Omit<Album, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ success: boolean; data?: Album; error?: string }> {
  if (data.slug) {
    const cleanSlug = slugify(data.slug);
    const isAvailable = await isAlbumSlugAvailable(cleanSlug, id);
    if (!isAvailable) {
      return { success: false, error: 'Slug sudah digunakan oleh album lain.' };
    }
    data.slug = cleanSlug;
  }

  const payload = {
    ...data,
    updated_at: new Date().toISOString(),
  };

  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('albums').update(payload).eq('id', id).select().single();
  });

  if (result.data && !result.error) {
    return { success: true, data: result.data as Album };
  }

  const idx = memoryAlbums.findIndex((a) => a.id === id);
  if (idx !== -1) {
    memoryAlbums[idx] = {
      ...memoryAlbums[idx],
      ...payload,
    };
    return { success: true, data: memoryAlbums[idx] };
  }

  return { success: false, error: 'Album tidak ditemukan.' };
}

/**
 * Delete an album.
 */
export async function deleteAlbum(id: string): Promise<{ success: boolean; error?: string }> {
  // First detach associated media
  await executeServerQuery(async (supabase) => {
    return supabase.from('media').update({ album_id: null }).eq('album_id', id);
  });
  memoryMedia.forEach((m) => {
    if (m.album_id === id) m.album_id = null;
  });

  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('albums').delete().eq('id', id);
  });

  if (!result.error && !result.isFallback) {
    return { success: true };
  }

  memoryAlbums = memoryAlbums.filter((a) => a.id !== id);
  return { success: true };
}

// ----------------------------------------------------------------------------
// MEDIA METHODS
// ----------------------------------------------------------------------------

export interface MediaFilterOptions {
  search?: string;
  media_type?: MediaType | 'ALL';
  album_id?: string | null;
  limit?: number;
  offset?: number;
}

/**
 * Get media items with flexible filtering.
 */
export async function getMediaItems(options: MediaFilterOptions = {}): Promise<MediaItem[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase.from('media').select('*');

    if (options.media_type && options.media_type !== 'ALL') {
      query = query.eq('media_type', options.media_type);
    }
    if (options.album_id !== undefined) {
      if (options.album_id === null) {
        query = query.is('album_id', null);
      } else {
        query = query.eq('album_id', options.album_id);
      }
    }
    if (options.search) {
      query = query.or(`title.ilike.%${options.search}%,caption.ilike.%${options.search}%,alt_text.ilike.%${options.search}%`);
    }

    query = query.order('created_at', { ascending: false });

    if (options.limit) {
      query = query.limit(options.limit);
    }
    if (options.offset) {
      query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
    }

    return query;
  });

  if (result.data && !result.error) {
    return result.data as MediaItem[];
  }

  let list = [...memoryMedia];

  if (options.media_type && options.media_type !== 'ALL') {
    list = list.filter((m) => m.media_type === options.media_type);
  }
  if (options.album_id !== undefined) {
    list = list.filter((m) => m.album_id === options.album_id);
  }
  if (options.search) {
    const s = options.search.toLowerCase();
    list = list.filter(
      (m) =>
        (m.title && m.title.toLowerCase().includes(s)) ||
        (m.caption && m.caption.toLowerCase().includes(s)) ||
        (m.alt_text && m.alt_text.toLowerCase().includes(s)) ||
        m.file_url.toLowerCase().includes(s)
    );
  }

  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  if (options.offset || options.limit) {
    const start = options.offset || 0;
    const end = options.limit ? start + options.limit : undefined;
    list = list.slice(start, end);
  }

  return list;
}

/**
 * Get media for an album.
 * If isPublicOnly is true, ensures the album itself is PUBLISHED.
 */
export async function getMediaByAlbum(albumId: string, isPublicOnly = true): Promise<MediaItem[]> {
  if (isPublicOnly) {
    const album = await getAlbumByIdForAdmin(albumId);
    if (!album || album.status !== 'PUBLISHED') {
      return [];
    }
  }

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

  return memoryMedia
    .filter((m) => m.album_id === albumId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

/**
 * Get a single media item by ID.
 */
export async function getMediaById(id: string): Promise<MediaItem | null> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('media').select('*').eq('id', id).maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as MediaItem;
  }

  return memoryMedia.find((m) => m.id === id) || null;
}

/**
 * Create a new media item record.
 */
export async function createMediaItem(
  data: Omit<MediaItem, 'id' | 'created_at'>
): Promise<{ success: boolean; data?: MediaItem; error?: string }> {
  const payload = {
    ...data,
    metadata: data.metadata || {},
  };

  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('media').insert(payload).select().single();
  });

  if (result.data && !result.error) {
    return { success: true, data: result.data as MediaItem };
  }

  const newItem: MediaItem = {
    ...payload,
    id: `med-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    created_at: new Date().toISOString(),
  };

  memoryMedia.unshift(newItem);
  return { success: true, data: newItem };
}

/**
 * Update media item metadata.
 */
export async function updateMediaItem(
  id: string,
  data: Partial<Omit<MediaItem, 'id' | 'created_at'>>
): Promise<{ success: boolean; data?: MediaItem; error?: string }> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('media').update(data).eq('id', id).select().single();
  });

  if (result.data && !result.error) {
    return { success: true, data: result.data as MediaItem };
  }

  const idx = memoryMedia.findIndex((m) => m.id === id);
  if (idx !== -1) {
    memoryMedia[idx] = {
      ...memoryMedia[idx],
      ...data,
    };
    return { success: true, data: memoryMedia[idx] };
  }

  return { success: false, error: 'Media tidak ditemukan.' };
}

/**
 * Delete a media item and its physical file.
 */
export async function deleteMediaItem(id: string): Promise<{ success: boolean; error?: string }> {
  const item = await getMediaById(id);
  if (!item) {
    return { success: false, error: 'Media tidak ditemukan.' };
  }

  // Delete physical file if applicable
  const storagePath = typeof item.metadata === 'object' && item.metadata !== null && 'storage_path' in item.metadata
    ? String((item.metadata as Record<string, unknown>).storage_path)
    : undefined;

  await deleteMediaFile(item.file_url, storagePath);

  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('media').delete().eq('id', id);
  });

  if (!result.error && !result.isFallback) {
    return { success: true };
  }

  memoryMedia = memoryMedia.filter((m) => m.id !== id);
  return { success: true };
}

/**
 * Attach multiple media items to an album.
 */
export async function attachMediaToAlbum(
  mediaIds: string[],
  albumId: string
): Promise<{ success: boolean; error?: string }> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('media').update({ album_id: albumId }).in('id', mediaIds);
  });

  if (!result.error && !result.isFallback) {
    return { success: true };
  }

  memoryMedia.forEach((m) => {
    if (mediaIds.includes(m.id)) {
      m.album_id = albumId;
    }
  });

  return { success: true };
}

/**
 * Detach a media item from its album.
 */
export async function detachMediaFromAlbum(mediaId: string): Promise<{ success: boolean; error?: string }> {
  return updateMediaItem(mediaId, { album_id: null });
}

/**
 * Public: Get published videos.
 */
export async function getPublishedVideos(limit?: number): Promise<MediaItem[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase
      .from('media')
      .select('*')
      .eq('media_type', 'VIDEO')
      .order('created_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }
    return query;
  });

  if (result.data && !result.error) {
    return result.data as MediaItem[];
  }

  let list = memoryMedia.filter((m) => m.media_type === 'VIDEO');
  if (limit) {
    list = list.slice(0, limit);
  }
  return list;
}
