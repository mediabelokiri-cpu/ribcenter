'use server';

import {
  createOrganization,
  updateOrganization,
  deleteOrganization,
} from '@/services/profile';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export interface OrgActionState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function createOrganizationAction(
  prevState: OrgActionState | null,
  formData: FormData
): Promise<OrgActionState> {
  await requireAdmin();

  const organizationName = (formData.get('organization_name') as string)?.trim();
  const role = (formData.get('role') as string)?.trim();
  const periodStart = (formData.get('period_start') as string)?.trim();
  const periodEndRaw = (formData.get('period_end') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const orderIndex = parseInt((formData.get('order_index') as string) || '1', 10);
  const isPublished = formData.get('is_published') === 'on';

  if (!organizationName || !role || !periodStart) {
    return { error: 'Nama organisasi, peran/jabatan, dan periode mulai wajib diisi.' };
  }

  const result = await createOrganization({
    organization_name: organizationName,
    role,
    period_start: periodStart,
    period_end: periodEndRaw || null,
    description: description || null,
    logo_url: null,
    order_index: isNaN(orderIndex) ? 1 : orderIndex,
    is_published: isPublished,
  });

  if (!result.success) {
    return { error: result.error || 'Gagal menambahkan organisasi.' };
  }

  revalidatePath('/tentang');
  revalidatePath('/admin/profil/organisasi');
  return { success: true, message: 'Organisasi berhasil ditambahkan.' };
}

export async function updateOrganizationAction(
  prevState: OrgActionState | null,
  formData: FormData
): Promise<OrgActionState> {
  await requireAdmin();

  const id = formData.get('id') as string;
  const organizationName = (formData.get('organization_name') as string)?.trim();
  const role = (formData.get('role') as string)?.trim();
  const periodStart = (formData.get('period_start') as string)?.trim();
  const periodEndRaw = (formData.get('period_end') as string)?.trim();
  const description = (formData.get('description') as string)?.trim();
  const orderIndex = parseInt((formData.get('order_index') as string) || '1', 10);
  const isPublished = formData.get('is_published') === 'on';

  if (!id || !organizationName || !role || !periodStart) {
    return { error: 'ID, nama organisasi, peran, dan periode mulai wajib diisi.' };
  }

  const result = await updateOrganization(id, {
    organization_name: organizationName,
    role,
    period_start: periodStart,
    period_end: periodEndRaw || null,
    description: description || null,
    order_index: isNaN(orderIndex) ? 1 : orderIndex,
    is_published: isPublished,
  });

  if (!result.success) {
    return { error: result.error || 'Gagal memperbarui organisasi.' };
  }

  revalidatePath('/tentang');
  revalidatePath('/admin/profil/organisasi');
  return { success: true, message: 'Organisasi berhasil diperbarui.' };
}

export async function deleteOrganizationAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get('id') as string;
  if (id) {
    await deleteOrganization(id);
    revalidatePath('/tentang');
    revalidatePath('/admin/profil/organisasi');
  }
}

export async function togglePublishOrganizationAction(formData: FormData): Promise<void> {
  await requireAdmin();

  const id = formData.get('id') as string;
  const currentStatus = formData.get('current_status') === 'true';

  if (id) {
    await updateOrganization(id, { is_published: !currentStatus });
    revalidatePath('/tentang');
    revalidatePath('/admin/profil/organisasi');
  }
}
