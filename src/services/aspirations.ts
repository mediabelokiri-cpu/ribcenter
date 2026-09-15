import { executeServerQuery } from '@/services/supabase';
import type { Aspiration, PublicAspirationInput } from '@/types/database';

const FALLBACK_ASPIRATIONS: Aspiration[] = [
  {
    id: '60000000-0000-0000-0000-000000000001',
    name: '[DUMMY] Warga Penguji 1',
    contact: '081234567890',
    regency: 'Kabupaten Contoh',
    district: 'Kecamatan Contoh',
    category: 'Infrastruktur',
    subject: '[DUMMY] Usulan Perbaikan Lampu Jalan',
    message: 'Mohon perhatian terkait penerangan jalan di desa uji coba.',
    attachment_url: null,
    status: 'BARU',
    internal_note:
      '[INTERNAL NOTE RAHASIA] Catatan tindak lanjut tim internal, tidak boleh terlihat oleh publik.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '60000000-0000-0000-0000-000000000002',
    name: '[DUMMY] Warga Penguji 2',
    contact: '089876543210',
    regency: 'Kabupaten Contoh',
    district: 'Kecamatan Contoh',
    category: 'Pendidikan',
    subject: '[DUMMY] Usulan Sarana Baca',
    message: 'Usulan penambahan buku bacaan perpustakaan desa.',
    attachment_url: null,
    status: 'DITINJAU',
    internal_note:
      '[INTERNAL NOTE RAHASIA] Telah diagendakan koordinasi dinas terkait.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

/**
 * Public intake action: Submit a citizen aspiration.
 * Default status is 'BARU', internal_note is null.
 */
export async function submitAspiration(
  input: PublicAspirationInput
): Promise<{ success: boolean; error?: string }> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('aspirations').insert({
      ...input,
      status: 'BARU',
      internal_note: null,
    });
  });

  if (result.error) {
    return { success: false, error: 'Gagal mengirimkan aspirasi.' };
  }

  return { success: true };
}

/**
 * Admin query: Retrieve all aspirations including internal notes and contacts.
 * Only callable by authorized Admins.
 */
export async function getAllAspirationsForAdmin(): Promise<Aspiration[]> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('aspirations')
      .select('*')
      .order('created_at', { ascending: false });
  });

  if (result.data && !result.error) {
    return result.data as Aspiration[];
  }

  return FALLBACK_ASPIRATIONS;
}
