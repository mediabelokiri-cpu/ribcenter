'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import {
  createActivityCategory,
  updateActivityCategory,
  deleteActivityCategory,
} from '@/services/activities';
import { slugify } from '@/lib/slug';

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const orderIndexStr = formData.get('order_index') as string;
  const isActive = formData.get('is_active') === 'on' || formData.get('is_active') === 'true';

  if (!name) {
    return { success: false, error: 'Nama kategori wajib diisi.' };
  }

  if (!slug) {
    slug = slugify(name);
  } else {
    slug = slugify(slug);
  }

  const order_index = orderIndexStr ? parseInt(orderIndexStr, 10) : 0;

  try {
    await createActivityCategory({
      name,
      slug,
      description,
      order_index: isNaN(order_index) ? 0 : order_index,
      is_active: isActive,
    });

    revalidatePath('/admin/rekam-kerja/kategori');
    revalidatePath('/admin/rekam-kerja');
    revalidatePath('/rekam-kerja');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal membuat kategori.';
    return { success: false, error: message };
  }
}

export async function updateCategoryAction(id: string, formData: FormData) {
  await requireAdmin();

  const name = (formData.get('name') as string)?.trim();
  let slug = (formData.get('slug') as string)?.trim();
  const description = (formData.get('description') as string)?.trim() || null;
  const orderIndexStr = formData.get('order_index') as string;
  const isActive = formData.get('is_active') === 'on' || formData.get('is_active') === 'true';

  if (!name) {
    return { success: false, error: 'Nama kategori wajib diisi.' };
  }

  if (!slug) {
    slug = slugify(name);
  } else {
    slug = slugify(slug);
  }

  const order_index = orderIndexStr ? parseInt(orderIndexStr, 10) : 0;

  try {
    await updateActivityCategory(id, {
      name,
      slug,
      description,
      order_index: isNaN(order_index) ? 0 : order_index,
      is_active: isActive,
    });

    revalidatePath('/admin/rekam-kerja/kategori');
    revalidatePath('/admin/rekam-kerja');
    revalidatePath('/rekam-kerja');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui kategori.';
    return { success: false, error: message };
  }
}

export async function deleteCategoryAction(id: string) {
  await requireAdmin();

  try {
    await deleteActivityCategory(id);
    revalidatePath('/admin/rekam-kerja/kategori');
    revalidatePath('/admin/rekam-kerja');
    revalidatePath('/rekam-kerja');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Gagal menghapus kategori.';
    return { success: false, error: message };
  }
}
