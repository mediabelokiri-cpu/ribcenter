'use server';

import { updateProfile } from '@/services/profile';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export interface ProfileActionState {
  error?: string;
  success?: boolean;
  message?: string;
}

export async function saveProfileAction(
  prevState: ProfileActionState | null,
  formData: FormData
): Promise<ProfileActionState> {
  // Enforce server-side admin guard
  await requireAdmin();

  const name = (formData.get('name') as string)?.trim();
  const displayName = (formData.get('display_name') as string)?.trim();
  const title = (formData.get('title') as string)?.trim();
  const biography = (formData.get('biography') as string)?.trim();
  const vision = (formData.get('vision') as string)?.trim();
  const mission = (formData.get('mission') as string)?.trim();
  const isPublished = formData.get('is_published') === 'on';

  // Education JSON parsing
  const educationRaw = formData.get('education') as string;
  let education = [];
  try {
    if (educationRaw) {
      education = JSON.parse(educationRaw);
    }
  } catch {
    return { error: 'Format data riwayat pendidikan tidak valid.' };
  }

  // Validation: Required fields
  if (!name || !displayName || !title) {
    return { error: 'Nama lengkap, display name, dan jabatan/headline wajib diisi.' };
  }

  const result = await updateProfile({
    name,
    display_name: displayName,
    title,
    biography,
    vision,
    mission,
    education,
    is_published: isPublished,
  });

  if (!result.success) {
    return { error: result.error || 'Gagal menyimpan pembaruan profil.' };
  }

  // Revalidate relevant pages
  revalidatePath('/');
  revalidatePath('/tentang');
  revalidatePath('/admin/profil');

  return { success: true, message: 'Profil utama berhasil diperbarui.' };
}
