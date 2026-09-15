'use server';

import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';
import { redirect } from 'next/navigation';

export interface ActionState {
  error?: string;
  success?: boolean;
}

/**
 * Server Action: Authenticate Admin via Supabase Auth.
 */
export async function loginAdmin(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Email dan password wajib diisi.' };
  }

  if (!isSupabaseConfigured()) {
    return {
      error:
        'Koneksi Supabase belum dikonfigurasi di lingkungan ini. Silakan atur kredensial di .env.local.',
    };
  }

  try {
    const supabase = await createClient();

    // 1. Authenticate with Supabase Auth
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.user) {
      return { error: 'Kredensial login tidak valid. Silakan coba lagi.' };
    }

    // 2. Verify authorization in admin_users table
    const { data: adminData, error: roleError } = await supabase
      .from('admin_users')
      .select('role')
      .eq('id', authData.user.id)
      .eq('role', 'ADMIN')
      .maybeSingle();

    if (roleError || !adminData) {
      // Sign out unauthorized user immediately
      await supabase.auth.signOut();
      return {
        error: 'Akses ditolak. Akun ini tidak memiliki hak akses Administrator.',
      };
    }
  } catch (err) {
    console.error('Login action unexpected error:', err);
    return { error: 'Terjadi kesalahan sistem saat memproses login.' };
  }

  redirect('/admin');
}

/**
 * Server Action: Logout Admin session.
 */
export async function logoutAdmin(): Promise<void> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Logout error:', err);
    }
  }

  redirect('/admin/login');
}
