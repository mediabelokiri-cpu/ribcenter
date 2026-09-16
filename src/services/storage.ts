import { promises as fs } from 'fs';
import path from 'path';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  mediaType?: 'IMAGE' | 'DOCUMENT';
}

export interface UploadResult {
  success: boolean;
  fileUrl?: string;
  storagePath?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  mediaType?: 'IMAGE' | 'DOCUMENT';
  error?: string;
}

const ALLOWED_IMAGE_MIMES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

const ALLOWED_DOCUMENT_MIMES = [
  'application/pdf',
];

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const MAX_DOCUMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Validates file type and size.
 */
export function validateMediaFile(file: { type: string; size: number; name: string }): FileValidationResult {
  const mime = file.type.toLowerCase();

  if (ALLOWED_IMAGE_MIMES.includes(mime)) {
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      return {
        valid: false,
        error: `Ukuran gambar terlalu besar. Maksimal ${MAX_IMAGE_SIZE_BYTES / (1024 * 1024)} MB.`,
      };
    }
    return { valid: true, mediaType: 'IMAGE' };
  }

  if (ALLOWED_DOCUMENT_MIMES.includes(mime)) {
    if (file.size > MAX_DOCUMENT_SIZE_BYTES) {
      return {
        valid: false,
        error: `Ukuran dokumen terlalu besar. Maksimal ${MAX_DOCUMENT_SIZE_BYTES / (1024 * 1024)} MB.`,
      };
    }
    return { valid: true, mediaType: 'DOCUMENT' };
  }

  return {
    valid: false,
    error: 'Format berkas tidak didukung. Hanya file JPG, PNG, WebP, GIF, SVG, dan PDF yang diperbolehkan.',
  };
}

/**
 * Generates a clean, unique file path.
 */
export function generateStoragePath(originalName: string): { relativePath: string; cleanFileName: string } {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');

  // Sanitize filename to alphanumeric and dashes
  const ext = path.extname(originalName).toLowerCase() || '.bin';
  const rawBase = path.basename(originalName, ext);
  const cleanBase = rawBase
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 50);

  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 7);
  const cleanFileName = `${cleanBase}-${timestamp}-${randomSuffix}${ext}`;
  const relativePath = `${year}/${month}/${cleanFileName}`;

  return { relativePath, cleanFileName };
}

/**
 * Uploads a file to Supabase Storage or local disk fallback.
 */
export async function uploadMediaFile(file: File): Promise<UploadResult> {
  const validation = validateMediaFile({
    type: file.type,
    size: file.size,
    name: file.name,
  });

  if (!validation.valid || !validation.mediaType) {
    return { success: false, error: validation.error || 'Berkas tidak valid.' };
  }

  const { relativePath, cleanFileName } = generateStoragePath(file.name);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // 1. Supabase Storage (if configured)
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const bucket = 'media';

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(relativePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (!error && data?.path) {
        const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(data.path);
        return {
          success: true,
          fileUrl: publicData.publicUrl,
          storagePath: data.path,
          fileName: cleanFileName,
          fileSize: file.size,
          mimeType: file.type,
          mediaType: validation.mediaType,
        };
      }
      console.warn('Supabase storage upload returned error, falling back to local storage:', error?.message);
    } catch (err) {
      console.warn('Supabase storage exception, falling back to local storage:', err);
    }
  }

  // 2. Local disk storage fallback (public/uploads/media/...)
  try {
    const localDir = path.join(process.cwd(), 'public', 'uploads', 'media', path.dirname(relativePath));
    await fs.mkdir(localDir, { recursive: true });

    const localFilePath = path.join(localDir, cleanFileName);
    await fs.writeFile(localFilePath, buffer);

    const publicUrl = `/uploads/media/${relativePath.replace(/\\/g, '/')}`;

    return {
      success: true,
      fileUrl: publicUrl,
      storagePath: `local:${relativePath}`,
      fileName: cleanFileName,
      fileSize: file.size,
      mimeType: file.type,
      mediaType: validation.mediaType,
    };
  } catch (err) {
    console.error('Failed to save file locally:', err);
    return {
      success: false,
      error: 'Gagal menyimpan berkas ke penyimpanan server.',
    };
  }
}

/**
 * Safely deletes a file from Supabase Storage or local disk.
 */
export async function deleteMediaFile(fileUrl: string, storagePath?: string): Promise<{ success: boolean; error?: string }> {
  // If local file
  if (fileUrl.startsWith('/uploads/media/')) {
    try {
      const relativePart = fileUrl.replace('/uploads/media/', '');
      const localFilePath = path.join(process.cwd(), 'public', 'uploads', 'media', relativePart);
      await fs.unlink(localFilePath).catch(() => {});
      return { success: true };
    } catch (err) {
      console.error('Error deleting local file:', err);
      return { success: false, error: 'Gagal menghapus berkas fisik lokal.' };
    }
  }

  // If Supabase Storage file
  if (isSupabaseConfigured() && storagePath && !storagePath.startsWith('local:')) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.storage.from('media').remove([storagePath]);
      if (error) {
        return { success: false, error: error.message };
      }
      return { success: true };
    } catch (err) {
      return { success: false, error: (err as Error).message };
    }
  }

  return { success: true };
}
