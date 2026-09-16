import { executeServerQuery } from '@/services/supabase';
import type { Aspiration, PublicAspirationInput, AspirationStatus } from '@/types/database';

export interface AspirationFilter {
  status?: AspirationStatus | 'ALL';
  category?: string;
  search?: string;
}

// ----------------------------------------------------------------------------
// IN-MEMORY FALLBACK STORE (For offline development & automated tests)
// ----------------------------------------------------------------------------

let memoryAspirations: Aspiration[] = [
  {
    id: '60000000-0000-0000-0000-000000000001',
    name: 'Budi Santoso',
    contact: '081234567890',
    regency: 'Kabupaten Kutai Kartanegara',
    district: 'Kecamatan Loa Kulu',
    category: 'Infrastruktur',
    subject: 'Perbaikan Lampu Penerangan Jalan Desa Ponoragan',
    message:
      'Mohon bantuan koordinasi untuk penambahan dan perbaikan lampu penerangan jalan utama desa yang telah padam sejak 2 bulan terakhir demi keselamatan warga di malam hari.',
    attachment_url: null,
    status: 'BARU',
    internal_note: null,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    updated_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: '60000000-0000-0000-0000-000000000002',
    name: 'Siti Rahmawati',
    contact: 'siti.rahmawati@example.com',
    regency: 'Kota Samarinda',
    district: 'Kecamatan Samarinda Utara',
    category: 'Pendidikan',
    subject: 'Bantuan Fasilitas Buku & Pojok Baca Komunitas',
    message:
      'Kami dari komunitas pemuda pegiat literasi memohon dukungan fasilitas buku bacaan dan rak buku untuk pojok baca anak-anak di lingkungan RT 05.',
    attachment_url: null,
    status: 'DITINJAU',
    internal_note:
      'Telah dihubungi tim perwakilan. Sedang didata judul buku yang dibutuhkan untuk koordinasi penyaluran CSR/bantuan literasi.',
    created_at: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 day ago
    updated_at: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: '60000000-0000-0000-0000-000000000003',
    name: 'Ahmad Fauzi',
    contact: '085299887766',
    regency: 'Kabupaten Kutai Timur',
    district: 'Kecamatan Sangatta Utara',
    category: 'Pertanian',
    subject: 'Keluhan Distribusi Pupuk Subsidi Petani Jagung',
    message:
      'Kelompok tani kami mengalami kendala keterlambatan pasokan pupuk subsidi menjelang masa tanam. Mohon advokasi ke instansi terkait agar alokasi segera tersalurkan.',
    attachment_url: null,
    status: 'DALAM_TINDAK_LANJUT',
    internal_note:
      'Sudah diteruskan kepada koordinator daerah Sangatta untuk verifikasi data kelompok tani terdaftar di Simluhtan.',
    created_at: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 days ago
    updated_at: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: '60000000-0000-0000-0000-000000000004',
    name: 'Dewi Lestari',
    contact: '081344556677',
    regency: 'Kota Balikpapan',
    district: 'Kecamatan Balikpapan Selatan',
    category: 'Kesehatan',
    subject: 'Sosialisasi Pencegahan Stunting Balita',
    message:
      'Aspirasi pelaksanaan program penyuluhan gizi terpadu dan pemberian makanan tambahan di posyandu binaan.',
    attachment_url: null,
    status: 'SELESAI',
    internal_note:
      'Program edukasi kesehatan dan paket PMT telah disalurkan bersama tim relawan pada 10 September 2026.',
    created_at: new Date(Date.now() - 3600000 * 120).toISOString(), // 5 days ago
    updated_at: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

/**
 * Public intake action: Submit a citizen aspiration.
 * Security & Privacy:
 * - Default status is always 'BARU'.
 * - internal_note is strictly null upon submission.
 * - Generates reference identifier for confirmation.
 */
export async function submitPublicAspiration(
  input: PublicAspirationInput
): Promise<{ success: boolean; data?: Aspiration; referenceId?: string; error?: string }> {
  const cleanName = (input.name || '').trim();
  const cleanContact = (input.contact || '').trim();
  const cleanSubject = (input.subject || '').trim();
  const cleanMessage = (input.message || '').trim();

  if (!cleanName || cleanName.length < 3) {
    return { success: false, error: 'Nama pelapor minimal 3 karakter.' };
  }
  if (!cleanContact) {
    return { success: false, error: 'Nomor kontak / email wajib diisi.' };
  }
  if (!cleanSubject || cleanSubject.length < 5) {
    return { success: false, error: 'Perihal aspirasi minimal 5 karakter.' };
  }
  if (!cleanMessage || cleanMessage.length < 15) {
    return { success: false, error: 'Isi aspirasi minimal 15 karakter.' };
  }

  const payload = {
    name: cleanName,
    contact: cleanContact,
    regency: input.regency ? input.regency.trim() : null,
    district: input.district ? input.district.trim() : null,
    category: input.category ? input.category.trim() : 'Lainnya',
    subject: cleanSubject,
    message: cleanMessage,
    attachment_url: input.attachment_url || null,
    status: 'BARU' as AspirationStatus,
    internal_note: null,
  };

  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('aspirations').insert(payload).select().single();
  });

  if (result.data && !result.error) {
    const created = result.data as Aspiration;
    const refCode = `ASP-${new Date().getFullYear()}-${created.id.slice(0, 8).toUpperCase()}`;
    return { success: true, data: created, referenceId: refCode };
  }

  // Fallback to in-memory store
  const id = `60000000-0000-0000-0000-${Date.now().toString().slice(-12)}`;
  const now = new Date().toISOString();
  const newRecord: Aspiration = {
    id,
    ...payload,
    created_at: now,
    updated_at: now,
  };

  memoryAspirations.unshift(newRecord);
  const refCode = `ASP-${new Date().getFullYear()}-${id.slice(0, 8).toUpperCase()}`;

  return { success: true, data: newRecord, referenceId: refCode };
}

/**
 * Backward compatibility alias for submitPublicAspiration
 */
export async function submitAspiration(
  input: PublicAspirationInput
): Promise<{ success: boolean; error?: string }> {
  const res = await submitPublicAspiration(input);
  return { success: res.success, error: res.error };
}

/**
 * Admin query: Retrieve all aspirations with optional search and filters.
 * STRICTLY for authorized Admins (contains contact & internal_note).
 */
export async function getAllAspirationsForAdmin(filter?: AspirationFilter): Promise<Aspiration[]> {
  const result = await executeServerQuery(async (supabase) => {
    let query = supabase.from('aspirations').select('*');

    if (filter?.status && filter.status !== 'ALL') {
      query = query.eq('status', filter.status);
    }
    if (filter?.category && filter.category !== 'ALL') {
      query = query.eq('category', filter.category);
    }
    if (filter?.search) {
      query = query.or(
        `name.ilike.%${filter.search}%,subject.ilike.%${filter.search}%,regency.ilike.%${filter.search}%,contact.ilike.%${filter.search}%`
      );
    }

    return query.order('created_at', { ascending: false });
  });

  if (result.data && !result.error) {
    return result.data as Aspiration[];
  }

  // In-memory fallback filtering
  let list = [...memoryAspirations];

  if (filter?.status && filter.status !== 'ALL') {
    list = list.filter((item) => item.status === filter.status);
  }
  if (filter?.category && filter.category !== 'ALL') {
    list = list.filter((item) => item.category === filter.category);
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        (item.regency && item.regency.toLowerCase().includes(q)) ||
        (item.contact && item.contact.toLowerCase().includes(q))
    );
  }

  return list.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

/**
 * Admin query: Get single aspiration by ID with full details.
 */
export async function getAspirationByIdForAdmin(id: string): Promise<Aspiration | null> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('aspirations').select('*').eq('id', id).maybeSingle();
  });

  if (result.data && !result.error) {
    return result.data as Aspiration;
  }

  return memoryAspirations.find((item) => item.id === id) || null;
}

/**
 * Admin action: Update aspiration workflow status.
 * Allowed statuses: 'BARU' | 'DITINJAU' | 'DALAM_TINDAK_LANJUT' | 'SELESAI' | 'INFORMASI_DIBERIKAN'
 */
export async function updateAspirationStatus(
  id: string,
  status: AspirationStatus
): Promise<{ success: boolean; error?: string }> {
  const allowedStatuses: AspirationStatus[] = [
    'BARU',
    'DITINJAU',
    'DALAM_TINDAK_LANJUT',
    'SELESAI',
    'INFORMASI_DIBERIKAN',
  ];

  if (!allowedStatuses.includes(status)) {
    return { success: false, error: `Status "${status}" tidak valid.` };
  }

  const now = new Date().toISOString();

  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('aspirations')
      .update({ status, updated_at: now })
      .eq('id', id);
  });

  if (result.error) {
    return {
      success: false,
      error: (result.error as { message?: string })?.message || 'Gagal mengubah status.',
    };
  }

  // Update in memory fallback
  const idx = memoryAspirations.findIndex((item) => item.id === id);
  if (idx !== -1) {
    memoryAspirations[idx] = {
      ...memoryAspirations[idx],
      status,
      updated_at: now,
    };
  }

  return { success: true };
}

/**
 * Admin action: Update internal notes.
 * Internal note is strictly confidential and never exposed to the public.
 */
export async function updateAspirationInternalNote(
  id: string,
  internalNote: string
): Promise<{ success: boolean; error?: string }> {
  const now = new Date().toISOString();

  const result = await executeServerQuery(async (supabase) => {
    return supabase
      .from('aspirations')
      .update({ internal_note: internalNote, updated_at: now })
      .eq('id', id);
  });

  if (result.error) {
    return {
      success: false,
      error: (result.error as { message?: string })?.message || 'Gagal menyimpan catatan internal.',
    };
  }

  // Update in memory fallback
  const idx = memoryAspirations.findIndex((item) => item.id === id);
  if (idx !== -1) {
    memoryAspirations[idx] = {
      ...memoryAspirations[idx],
      internal_note: internalNote,
      updated_at: now,
    };
  }

  return { success: true };
}

/**
 * Admin action: Delete aspiration record (e.g. spam/abuse cleanup).
 */
export async function deleteAspiration(id: string): Promise<{ success: boolean; error?: string }> {
  const result = await executeServerQuery(async (supabase) => {
    return supabase.from('aspirations').delete().eq('id', id);
  });

  if (result.error) {
    return {
      success: false,
      error: (result.error as { message?: string })?.message || 'Gagal menghapus data aspirasi.',
    };
  }

  memoryAspirations = memoryAspirations.filter((item) => item.id !== id);
  return { success: true };
}

/**
 * Testing helper: Get count of aspirations by status.
 */
export async function getAspirationMetricsForAdmin(): Promise<{
  total: number;
  baru: number;
  ditinjau: number;
  dalamTindakLanjut: number;
  selesai: number;
  informasiDiberikan: number;
}> {
  const all = await getAllAspirationsForAdmin();

  return {
    total: all.length,
    baru: all.filter((a) => a.status === 'BARU').length,
    ditinjau: all.filter((a) => a.status === 'DITINJAU').length,
    dalamTindakLanjut: all.filter((a) => a.status === 'DALAM_TINDAK_LANJUT').length,
    selesai: all.filter((a) => a.status === 'SELESAI').length,
    informasiDiberikan: all.filter((a) => a.status === 'INFORMASI_DIBERIKAN').length,
  };
}
