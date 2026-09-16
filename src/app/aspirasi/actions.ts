'use server';

import { submitPublicAspiration } from '@/services/aspirations';
import { uploadMediaFile } from '@/services/storage';

export interface SubmitAspirationResult {
  success: boolean;
  referenceId?: string;
  message?: string;
  error?: string;
}

export async function submitAspirationAction(formData: FormData): Promise<SubmitAspirationResult> {
  try {
    // 1. Bot Honeypot Protection
    // Hidden field that humans don't fill out; bots fill out automatically
    const honeypot = formData.get('hp_code_check') as string | null;
    if (honeypot && honeypot.trim().length > 0) {
      console.warn('Bot submission blocked via honeypot trap.');
      return {
        success: false,
        error: 'Pengiriman tidak dapat diproses. Silakan muat ulang halaman.',
      };
    }

    // 2. Extract and sanitize fields
    const name = (formData.get('name') as string)?.trim() || '';
    const contact = (formData.get('contact') as string)?.trim() || '';
    const regency = (formData.get('regency') as string)?.trim() || null;
    const district = (formData.get('district') as string)?.trim() || null;
    const category = (formData.get('category') as string)?.trim() || 'Lainnya';
    const subject = (formData.get('subject') as string)?.trim() || '';
    const message = (formData.get('message') as string)?.trim() || '';

    // 3. Validation
    if (!name || name.length < 3) {
      return { success: false, error: 'Nama lengkap wajib diisi minimal 3 karakter.' };
    }
    if (!contact || contact.length < 5) {
      return { success: false, error: 'Nomor WhatsApp atau email aktif wajib diisi.' };
    }
    if (!subject || subject.length < 5) {
      return { success: false, error: 'Perihal aspirasi wajib diisi minimal 5 karakter.' };
    }
    if (!message || message.length < 15) {
      return { success: false, error: 'Uraian aspirasi wajib diisi minimal 15 karakter.' };
    }

    // 4. Handle optional attachment
    let attachmentUrl: string | null = null;
    const attachmentFile = formData.get('attachment') as File | null;

    if (attachmentFile && attachmentFile instanceof File && attachmentFile.size > 0) {
      const uploadRes = await uploadMediaFile(attachmentFile);
      if (!uploadRes.success || !uploadRes.fileUrl) {
        return {
          success: false,
          error: uploadRes.error || 'Gagal memproses berkas lampiran. Pastikan format JPG, PNG, atau PDF (maks 5MB/10MB).',
        };
      }
      attachmentUrl = uploadRes.fileUrl;
    }

    // 5. Submit through service layer
    const result = await submitPublicAspiration({
      name,
      contact,
      regency,
      district,
      category,
      subject,
      message,
      attachment_url: attachmentUrl,
    });

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Gagal mengirim aspirasi. Silakan coba beberapa saat lagi.',
      };
    }

    return {
      success: true,
      referenceId: result.referenceId,
      message: 'Aspirasi Anda telah berhasil dikirimkan kepada tim Rahmat Ichwan Bahtiar.',
    };
  } catch (err) {
    console.error('submitAspirationAction error:', err);
    return {
      success: false,
      error: 'Terjadi kesalahan sistem saat mengirimkan aspirasi. Silakan hubungi kami via WhatsApp.',
    };
  }
}
