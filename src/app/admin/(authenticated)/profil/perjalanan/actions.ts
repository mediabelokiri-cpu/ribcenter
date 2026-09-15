'use server';

import {
  createTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
} from '@/services/profile';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import type { TimelineCategory } from '@/types/database';

export interface TimelineActionState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function createTimelineAction(
  prevState: TimelineActionState | null,
  formData: FormData
): Promise<TimelineActionState> {
  await requireAdmin();

  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const category = (formData.get('category') as TimelineCategory) || 'POLITIK';
  const yearStart = parseInt(formData.get('year_start') as string, 10);
  const yearEndRaw = formData.get('year_end') as string;
  const yearEnd = yearEndRaw ? parseInt(yearEndRaw, 10) : null;
  const orderIndex = parseInt((formData.get('order_index') as string) || '1', 10);
  const isPublished = formData.get('is_published') === 'on';

  if (!title || !description || isNaN(yearStart)) {
    return { error: 'Judul, deskripsi, dan tahun mulai wajib diisi.' };
  }

  const result = await createTimelineItem({
    title,
    description,
    category,
    year_start: yearStart,
    year_end: yearEnd,
    order_index: isNaN(orderIndex) ? 1 : orderIndex,
    image_url: null,
    is_published: isPublished,
  });

  if (!result.success) {
    return { error: result.error || 'Gagal menambahkan linimasa.' };
  }

  revalidatePath('/tentang');
  revalidatePath('/admin/profil/perjalanan');
  return { success: true, message: 'Linimasa berhasil ditambahkan.' };
}

export async function updateTimelineAction(
  prevState: TimelineActionState | null,
  formData: FormData
): Promise<TimelineActionState> {
  await requireAdmin();

  const id = formData.get('id') as string;
  const title = (formData.get('title') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const category = (formData.get('category') as TimelineCategory) || 'POLITIK';
  const yearStart = parseInt(formData.get('year_start') as string, 10);
  const yearEndRaw = formData.get('year_end') as string;
  const yearEnd = yearEndRaw ? parseInt(yearEndRaw, 10) : null;
  const orderIndex = parseInt((formData.get('order_index') as string) || '1', 10);
  const isPublished = formData.get('is_published') === 'on';

  if (!id || !title || !description || isNaN(yearStart)) {
    return { error: 'ID, judul, deskripsi, dan tahun mulai wajib diisi.' };
  }

  const result = await updateTimelineItem(id, {
    title,
    description,
    category,
    year_start: yearStart,
    year_end: yearEnd,
    order_index: isNaN(orderIndex) ? 1 : orderIndex,
    is_published: isPublished,
  });

  if (!result.success) {
    return { error: result.error || 'Gagal memperbarui linimasa.' };
  }

  revalidatePath('/tentang');
  revalidatePath('/admin/profil/perjalanan');
  return { success: true, message: 'Linimasa berhasil diperbarui.' };
}

export async function deleteTimelineAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get('id') as string;
  if (id) {
    await deleteTimelineItem(id);
    revalidatePath('/tentang');
    revalidatePath('/admin/profil/perjalanan');
  }
}

export async function togglePublishTimelineAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get('id') as string;
  const currentStatus = formData.get('current_status') === 'true';

  if (id) {
    await updateTimelineItem(id, { is_published: !currentStatus });
    revalidatePath('/tentang');
    revalidatePath('/admin/profil/perjalanan');
  }
}
