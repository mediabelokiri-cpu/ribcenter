import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/env';

/**
 * Executes a Supabase query on the server safely.
 * Returns null if Supabase is unconfigured in development.
 */
export async function executeServerQuery<T>(
  queryFn: (client: Awaited<ReturnType<typeof createClient>>) => Promise<{ data: T | null; error: unknown }>
): Promise<{ data: T | null; error: unknown | null; isFallback: boolean }> {
  if (!isSupabaseConfigured()) {
    return { data: null, error: null, isFallback: true };
  }

  try {
    const client = await createClient();
    const result = await queryFn(client);
    return {
      data: result.data,
      error: result.error,
      isFallback: false,
    };
  } catch (err) {
    console.error('Supabase query exception:', err);
    return { data: null, error: err, isFallback: false };
  }
}
