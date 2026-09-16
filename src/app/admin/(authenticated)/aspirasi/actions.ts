'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import {
  updateAspirationStatus,
  updateAspirationInternalNote,
  deleteAspiration,
} from '@/services/aspirations';
import type { AspirationStatus } from '@/types/database';

export async function updateAspirationStatusAction(id: string, status: AspirationStatus) {
  try {
    await requireAdmin();

    if (!id) {
      return { success: false, error: 'ID aspirasi tidak valid.' };
    }

    const res = await updateAspirationStatus(id, status);
    if (!res.success) {
      return { success: false, error: res.error || 'Gagal memperbarui status.' };
    }

    revalidatePath('/admin/aspirasi');
    return { success: true };
  } catch (err) {
    console.error('updateAspirationStatusAction error:', err);
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

export async function updateAspirationInternalNoteAction(id: string, internalNote: string) {
  try {
    await requireAdmin();

    if (!id) {
      return { success: false, error: 'ID aspirasi tidak valid.' };
    }

    const res = await updateAspirationInternalNote(id, internalNote);
    if (!res.success) {
      return { success: false, error: res.error || 'Gagal menyimpan catatan internal.' };
    }

    revalidatePath('/admin/aspirasi');
    return { success: true };
  } catch (err) {
    console.error('updateAspirationInternalNoteAction error:', err);
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

export async function deleteAspirationAction(id: string) {
  try {
    await requireAdmin();

    if (!id) {
      return { success: false, error: 'ID aspirasi tidak valid.' };
    }

    const res = await deleteAspiration(id);
    if (!res.success) {
      return { success: false, error: res.error || 'Gagal menghapus aspirasi.' };
    }

    revalidatePath('/admin/aspirasi');
    return { success: true };
  } catch (err) {
    console.error('deleteAspirationAction error:', err);
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}
