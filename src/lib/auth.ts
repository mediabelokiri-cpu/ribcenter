import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';
import type { AdminUser } from '@/types/database';
import { redirect } from 'next/navigation';

export interface AdminSession {
  user: {
    id: string;
    email: string;
  };
  admin: AdminUser;
}

/**
 * Retrieves the currently authenticated Supabase user on the server.
 */
export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    console.error('Error fetching current user:', err);
    return null;
  }
}

/**
 * Retrieves the currently authenticated Admin profile.
 * Verifies both Supabase Auth session and the presence of role 'ADMIN' in public.admin_users.
 */
export async function getCurrentAdmin(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) {
    // In local development before Supabase project is linked, return null so admin stays protected
    return null;
  }

  const user = await getCurrentUser();
  if (!user || !user.email) {
    return null;
  }

  try {
    const supabase = await createClient();
    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', user.id)
      .eq('role', 'ADMIN')
      .maybeSingle();

    if (error || !admin) {
      return null;
    }

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      admin: admin as AdminUser,
    };
  } catch (err) {
    console.error('Error fetching admin profile:', err);
    return null;
  }
}

/**
 * Server-side authorization guard.
 * Must be invoked in protected Admin layout or Server Actions.
 * Redirects unauthenticated / unauthorized requests to /admin/login.
 */
export async function requireAdmin(): Promise<AdminSession> {
  const session = await getCurrentAdmin();

  if (!session) {
    redirect('/admin/login');
  }

  return session;
}
