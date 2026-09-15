'use server';

import {
  getHomepageSections,
  updateHomepageSection,
  reorderHomepageSections,
} from '@/services/homepage';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export interface SectionActionState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function updateSectionConfigAction(
  prevState: SectionActionState | null,
  formData: FormData
): Promise<SectionActionState> {
  await requireAdmin();

  const id = formData.get('id') as string;
  const title = (formData.get('title') as string)?.trim();
  const isActive = formData.get('is_active') === 'on';

  if (!id || !title) {
    return { error: 'ID dan judul section wajib diisi.' };
  }

  // Parse content configuration fields dynamically based on section
  const contentRaw = formData.get('content') as string;
  let content = {};
  try {
    if (contentRaw) {
      content = JSON.parse(contentRaw);
    }
  } catch {
    return { error: 'Format konfigurasi konten tidak valid.' };
  }

  const result = await updateHomepageSection(id, {
    title,
    is_active: isActive,
    content,
  });

  if (!result.success) {
    return { error: result.error || 'Gagal memperbarui konfigurasi section.' };
  }

  revalidatePath('/');
  revalidatePath('/admin/homepage');
  return { success: true, message: `Konfigurasi section "${title}" berhasil disimpan.` };
}

export async function toggleSectionActiveAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get('id') as string;
  const currentStatus = formData.get('current_status') === 'true';

  if (id) {
    await updateHomepageSection(id, { is_active: !currentStatus });
    revalidatePath('/');
    revalidatePath('/admin/homepage');
  }
}

export async function moveSectionAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get('id') as string;
  const direction = formData.get('direction') as 'up' | 'down';

  if (!id) return;

  const sections = await getHomepageSections(false);
  const currentIndex = sections.findIndex((s) => s.id === id);

  if (currentIndex === -1) return;

  const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  if (targetIndex < 0 || targetIndex >= sections.length) return;

  // Swap sections
  const newSections = [...sections];
  const temp = newSections[currentIndex];
  newSections[currentIndex] = newSections[targetIndex];
  newSections[targetIndex] = temp;

  await reorderHomepageSections(newSections.map((s) => s.id));

  revalidatePath('/');
  revalidatePath('/admin/homepage');
}
