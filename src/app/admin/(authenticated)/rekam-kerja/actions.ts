'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import {
  createActivity,
  updateActivity,
  deleteActivity,
} from '@/services/activities';
import type { ActivityType, ContentStatus } from '@/types/database';
import { slugify } from '@/lib/slug';

export async function createActivityAction(formData: FormData) {
  await requireAdmin();

  const title = (formData.get('title') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim();
  const type = formData.get('type') as ActivityType;
  const categoryId = (formData.get('category_id') as string)?.trim() || null;
  const date = (formData.get('date') as string)?.trim();
  const location = (formData.get('location') as string)?.trim() || null;
  const regency = (formData.get('regency') as string)?.trim() || null;
  const district = (formData.get('district') as string)?.trim() || null;
  const summary = (formData.get('summary') as string)?.trim() || null;
  const description = (formData.get('description') as string)?.trim();
  const beneficiariesStr = formData.get('beneficiaries') as string;
  const status = (formData.get('status') as ContentStatus) || 'PUBLISHED';
  const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';
  const coverImageUrl = (formData.get('cover_image_url') as string)?.trim() || null;
  const videoUrl = (formData.get('video_url') as string)?.trim() || null;

  if (!title) {
    return { success: false, error: 'Judul kegiatan wajib diisi.' };
  }
  if (!type) {
    return { success: false, error: 'Tipe kegiatan wajib dipilih.' };
  }
  if (!date) {
    return { success: false, error: 'Tanggal pelaksanaan wajib diisi.' };
  }
  if (!description) {
    return { success: false, error: 'Deskripsi lengkap kegiatan wajib diisi.' };
  }

  if (!slug) {
    slug = slugify(title);
  } else {
    slug = slugify(slug);
  }

  const beneficiaries = beneficiariesStr ? parseInt(beneficiariesStr, 10) : 0;

  try {
    const newActivity = await createActivity({
      title,
      slug,
      type,
      category_id: categoryId,
      date,
      location,
      regency,
      district,
      summary,
      description,
      beneficiaries: isNaN(beneficiaries) ? 0 : beneficiaries,
      status,
      featured,
      cover_image_url: coverImageUrl,
      video_url: videoUrl,
    });

    revalidatePath('/admin/rekam-kerja');
    revalidatePath('/rekam-kerja');
    revalidatePath(`/rekam-kerja/${newActivity.slug}`);
    revalidatePath('/');
    return { success: true, activityId: newActivity.id, slug: newActivity.slug };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal membuat rekam kerja.';
    return { success: false, error: message };
  }
}

export async function updateActivityAction(id: string, formData: FormData) {
  await requireAdmin();

  const title = (formData.get('title') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim();
  const type = formData.get('type') as ActivityType;
  const categoryId = (formData.get('category_id') as string)?.trim() || null;
  const date = (formData.get('date') as string)?.trim();
  const location = (formData.get('location') as string)?.trim() || null;
  const regency = (formData.get('regency') as string)?.trim() || null;
  const district = (formData.get('district') as string)?.trim() || null;
  const summary = (formData.get('summary') as string)?.trim() || null;
  const description = (formData.get('description') as string)?.trim();
  const beneficiariesStr = formData.get('beneficiaries') as string;
  const status = (formData.get('status') as ContentStatus) || 'PUBLISHED';
  const featured = formData.get('featured') === 'on' || formData.get('featured') === 'true';
  const coverImageUrl = (formData.get('cover_image_url') as string)?.trim() || null;
  const videoUrl = (formData.get('video_url') as string)?.trim() || null;

  if (!title) {
    return { success: false, error: 'Judul kegiatan wajib diisi.' };
  }
  if (!type) {
    return { success: false, error: 'Tipe kegiatan wajib dipilih.' };
  }
  if (!date) {
    return { success: false, error: 'Tanggal pelaksanaan wajib diisi.' };
  }
  if (!description) {
    return { success: false, error: 'Deskripsi lengkap kegiatan wajib diisi.' };
  }

  if (!slug) {
    slug = slugify(title);
  } else {
    slug = slugify(slug);
  }

  const beneficiaries = beneficiariesStr ? parseInt(beneficiariesStr, 10) : 0;

  try {
    const updated = await updateActivity(id, {
      title,
      slug,
      type,
      category_id: categoryId,
      date,
      location,
      regency,
      district,
      summary,
      description,
      beneficiaries: isNaN(beneficiaries) ? 0 : beneficiaries,
      status,
      featured,
      cover_image_url: coverImageUrl,
      video_url: videoUrl,
    });

    revalidatePath('/admin/rekam-kerja');
    revalidatePath(`/admin/rekam-kerja/${id}/edit`);
    revalidatePath('/rekam-kerja');
    revalidatePath(`/rekam-kerja/${updated.slug}`);
    revalidatePath('/');
    return { success: true, slug: updated.slug };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui rekam kerja.';
    return { success: false, error: message };
  }
}

export async function deleteActivityAction(id: string) {
  await requireAdmin();

  try {
    await deleteActivity(id);
    revalidatePath('/admin/rekam-kerja');
    revalidatePath('/rekam-kerja');
    revalidatePath('/');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus rekam kerja.';
    return { success: false, error: message };
  }
}

export async function togglePublishActivityAction(id: string, newStatus: ContentStatus) {
  await requireAdmin();

  try {
    await updateActivity(id, { status: newStatus });
    revalidatePath('/admin/rekam-kerja');
    revalidatePath('/rekam-kerja');
    revalidatePath('/');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengubah status publikasi.';
    return { success: false, error: message };
  }
}

export async function toggleFeaturedActivityAction(id: string, featured: boolean) {
  await requireAdmin();

  try {
    await updateActivity(id, { featured });
    revalidatePath('/admin/rekam-kerja');
    revalidatePath('/rekam-kerja');
    revalidatePath('/');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal mengubah status unggulan.';
    return { success: false, error: message };
  }
}
