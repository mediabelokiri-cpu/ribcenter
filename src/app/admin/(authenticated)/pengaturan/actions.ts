'use server';

import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { updateSiteSettingByKey } from '@/services/settings';

export async function saveContactSettingsAction(formData: FormData) {
  try {
    await requireAdmin();

    const email = (formData.get('email') as string)?.trim() || '';
    const whatsapp = (formData.get('whatsapp') as string)?.trim() || '';
    const address = (formData.get('address') as string)?.trim() || '';
    const officeHours = (formData.get('office_hours') as string)?.trim() || '';
    const mapEmbedUrl = (formData.get('map_embed_url') as string)?.trim() || '';

    if (!email) {
      return { success: false, error: 'Email resmi wajib diisi.' };
    }
    if (!whatsapp) {
      return { success: false, error: 'Nomor WhatsApp resmi wajib diisi.' };
    }

    const res = await updateSiteSettingByKey('contact', {
      email,
      whatsapp,
      address,
      office_hours: officeHours,
      map_embed_url: mapEmbedUrl,
    });

    if (!res.success) {
      return { success: false, error: res.error || 'Gagal menyimpan pengaturan kontak.' };
    }

    revalidatePath('/kontak');
    revalidatePath('/admin/pengaturan');
    revalidatePath('/');

    return { success: true };
  } catch (err) {
    console.error('saveContactSettingsAction error:', err);
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

export async function saveSocialSettingsAction(formData: FormData) {
  try {
    await requireAdmin();

    const instagram = (formData.get('instagram') as string)?.trim() || '';
    const facebook = (formData.get('facebook') as string)?.trim() || '';
    const tiktok = (formData.get('tiktok') as string)?.trim() || '';
    const youtube = (formData.get('youtube') as string)?.trim() || '';
    const twitter = (formData.get('twitter') as string)?.trim() || '';

    const res = await updateSiteSettingByKey('social', {
      instagram,
      facebook,
      tiktok,
      youtube,
      twitter,
    });

    if (!res.success) {
      return { success: false, error: res.error || 'Gagal menyimpan pengaturan media sosial.' };
    }

    revalidatePath('/kontak');
    revalidatePath('/admin/pengaturan');
    revalidatePath('/');

    return { success: true };
  } catch (err) {
    console.error('saveSocialSettingsAction error:', err);
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}

export async function saveGeneralSettingsAction(formData: FormData) {
  try {
    await requireAdmin();

    const siteName = (formData.get('site_name') as string)?.trim() || '';
    const siteTagline = (formData.get('site_tagline') as string)?.trim() || '';
    const description = (formData.get('description') as string)?.trim() || '';

    if (!siteName) {
      return { success: false, error: 'Nama situs wajib diisi.' };
    }

    const res = await updateSiteSettingByKey('general', {
      site_name: siteName,
      site_tagline: siteTagline,
      description,
    });

    if (!res.success) {
      return { success: false, error: res.error || 'Gagal menyimpan pengaturan umum.' };
    }

    revalidatePath('/');
    revalidatePath('/admin/pengaturan');

    return { success: true };
  } catch (err) {
    console.error('saveGeneralSettingsAction error:', err);
    return { success: false, error: (err as Error).message || 'Terjadi kesalahan sistem.' };
  }
}
