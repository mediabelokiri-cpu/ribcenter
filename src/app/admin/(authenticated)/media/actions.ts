'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { uploadMediaFile } from '@/services/storage';
import {
  createMediaItem,
  updateMediaItem,
  deleteMediaItem,
  createAlbum,
  updateAlbum,
  deleteAlbum,
  parseVideoUrl,
  attachMediaToAlbum,
  detachMediaFromAlbum,
} from '@/services/media';
import type { ContentStatus } from '@/types/database';

// ----------------------------------------------------------------------------
// MEDIA ASSET ACTIONS
// ----------------------------------------------------------------------------

export async function uploadMediaAction(formData: FormData) {
  try {
    await requireAdmin();

    const file = formData.get('file') as File | null;
    if (!file || !(file instanceof File)) {
      return { success: false, error: 'Silakan pilih berkas yang valid untuk diunggah.' };
    }

    const title = (formData.get('title') as string)?.trim() || file.name.replace(/\.[^/.]+$/, '');
    const altText = (formData.get('alt_text') as string)?.trim() || title;
    const caption = (formData.get('caption') as string)?.trim() || null;
    const albumId = (formData.get('album_id') as string)?.trim() || null;

    const uploadRes = await uploadMediaFile(file);
    if (!uploadRes.success || !uploadRes.fileUrl || !uploadRes.mediaType) {
      return { success: false, error: uploadRes.error || 'Gagal mengunggah berkas.' };
    }

    const mediaRes = await createMediaItem({
      album_id: albumId,
      file_url: uploadRes.fileUrl,
      media_type: uploadRes.mediaType,
      title,
      alt_text: altText,
      caption,
      metadata: {
        file_name: uploadRes.fileName,
        file_size: uploadRes.fileSize,
        mime_type: uploadRes.mimeType,
        storage_path: uploadRes.storagePath,
      },
    });

    if (!mediaRes.success) {
      return { success: false, error: mediaRes.error || 'Gagal mencatat metadata media.' };
    }

    revalidatePath('/admin/media');
    revalidatePath('/galeri');
    return { success: true, data: mediaRes.data };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

export async function createVideoMediaAction(formData: FormData) {
  try {
    await requireAdmin();

    const rawUrl = (formData.get('video_url') as string)?.trim();
    if (!rawUrl) {
      return { success: false, error: 'Tautan video wajib diisi.' };
    }

    const title = (formData.get('title') as string)?.trim();
    if (!title) {
      return { success: false, error: 'Judul video wajib diisi.' };
    }

    const caption = (formData.get('caption') as string)?.trim() || null;
    const albumId = (formData.get('album_id') as string)?.trim() || null;

    const videoInfo = parseVideoUrl(rawUrl);

    const mediaRes = await createMediaItem({
      album_id: albumId,
      file_url: rawUrl,
      media_type: 'VIDEO',
      title,
      alt_text: title,
      caption,
      metadata: {
        platform: videoInfo.platform,
        videoId: videoInfo.videoId || null,
        embed_url: videoInfo.embedUrl,
        thumbnail_url: videoInfo.thumbnailUrl,
      },
    });

    if (!mediaRes.success) {
      return { success: false, error: mediaRes.error || 'Gagal menyimpan video eksternal.' };
    }

    revalidatePath('/admin/media');
    revalidatePath('/galeri');
    return { success: true, data: mediaRes.data };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

export async function updateMediaAction(id: string, formData: FormData) {
  try {
    await requireAdmin();

    const title = (formData.get('title') as string)?.trim() || null;
    const altText = (formData.get('alt_text') as string)?.trim() || null;
    const caption = (formData.get('caption') as string)?.trim() || null;
    const albumIdRaw = formData.get('album_id') as string;
    const albumId = albumIdRaw ? albumIdRaw.trim() : null;

    const res = await updateMediaItem(id, {
      title,
      alt_text: altText,
      caption,
      album_id: albumId,
    });

    if (!res.success) {
      return { success: false, error: res.error || 'Gagal memperbarui media.' };
    }

    revalidatePath('/admin/media');
    revalidatePath('/galeri');
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

export async function deleteMediaAction(id: string) {
  try {
    await requireAdmin();

    const res = await deleteMediaItem(id);
    if (!res.success) {
      return { success: false, error: res.error || 'Gagal menghapus media.' };
    }

    revalidatePath('/admin/media');
    revalidatePath('/galeri');
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

// ----------------------------------------------------------------------------
// ALBUM ACTIONS
// ----------------------------------------------------------------------------

export async function createAlbumAction(formData: FormData) {
  try {
    await requireAdmin();

    const title = (formData.get('title') as string)?.trim();
    if (!title) {
      return { success: false, error: 'Judul album wajib diisi.' };
    }

    const slug = (formData.get('slug') as string)?.trim() || '';
    const description = (formData.get('description') as string)?.trim() || null;
    const coverImageUrl = (formData.get('cover_image_url') as string)?.trim() || null;
    const featured = formData.get('featured') === 'true';
    const orderIndex = parseInt(formData.get('order_index') as string, 10) || 0;
    const status = (formData.get('status') as ContentStatus) || 'PUBLISHED';

    const res = await createAlbum({
      title,
      slug,
      description,
      cover_image_url: coverImageUrl,
      featured,
      order_index: orderIndex,
      status,
    });

    if (!res.success) {
      return { success: false, error: res.error || 'Gagal membuat album.' };
    }

    revalidatePath('/admin/media/album');
    revalidatePath('/galeri');
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

export async function updateAlbumAction(id: string, formData: FormData) {
  try {
    await requireAdmin();

    const title = (formData.get('title') as string)?.trim();
    if (!title) {
      return { success: false, error: 'Judul album wajib diisi.' };
    }

    const slug = (formData.get('slug') as string)?.trim() || '';
    const description = (formData.get('description') as string)?.trim() || null;
    const coverImageUrl = (formData.get('cover_image_url') as string)?.trim() || null;
    const featured = formData.get('featured') === 'true';
    const orderIndex = parseInt(formData.get('order_index') as string, 10) || 0;
    const status = (formData.get('status') as ContentStatus) || 'PUBLISHED';

    const res = await updateAlbum(id, {
      title,
      slug,
      description,
      cover_image_url: coverImageUrl,
      featured,
      order_index: orderIndex,
      status,
    });

    if (!res.success) {
      return { success: false, error: res.error || 'Gagal memperbarui album.' };
    }

    revalidatePath('/admin/media/album');
    revalidatePath('/galeri');
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

export async function deleteAlbumAction(id: string) {
  try {
    await requireAdmin();

    const res = await deleteAlbum(id);
    if (!res.success) {
      return { success: false, error: res.error || 'Gagal menghapus album.' };
    }

    revalidatePath('/admin/media/album');
    revalidatePath('/galeri');
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

export async function toggleAlbumStatusAction(id: string, status: ContentStatus) {
  try {
    await requireAdmin();

    const res = await updateAlbum(id, { status });
    if (!res.success) {
      return { success: false, error: res.error || 'Gagal memperbarui status album.' };
    }

    revalidatePath('/admin/media/album');
    revalidatePath('/galeri');
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

export async function toggleAlbumFeaturedAction(id: string, featured: boolean) {
  try {
    await requireAdmin();

    const res = await updateAlbum(id, { featured });
    if (!res.success) {
      return { success: false, error: res.error || 'Gagal memperbarui status unggulan.' };
    }

    revalidatePath('/admin/media/album');
    revalidatePath('/galeri');
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

export async function attachMediaToAlbumAction(mediaIds: string[], albumId: string) {
  try {
    await requireAdmin();

    const res = await attachMediaToAlbum(mediaIds, albumId);
    if (!res.success) {
      return { success: false, error: res.error || 'Gagal menautkan media ke album.' };
    }

    revalidatePath('/admin/media');
    revalidatePath('/admin/media/album');
    revalidatePath('/galeri');
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

export async function detachMediaFromAlbumAction(mediaId: string) {
  try {
    await requireAdmin();

    const res = await detachMediaFromAlbum(mediaId);
    if (!res.success) {
      return { success: false, error: res.error || 'Gagal melepaskan media dari album.' };
    }

    revalidatePath('/admin/media');
    revalidatePath('/admin/media/album');
    revalidatePath('/galeri');
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}
