/**
 * Environment configuration and validation helper.
 * Provides safe access to environment variables across client and server.
 */

export interface PublicEnv {
  appUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  isConfigured: boolean;
}

export interface ServerEnv extends PublicEnv {
  supabaseServiceRoleKey?: string;
}

/**
 * Validates whether Supabase public credentials are provided.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    anonKey &&
    url !== 'your-supabase-project-url' &&
    anonKey !== 'your-supabase-anon-key' &&
    !url.includes('placeholder') &&
    !anonKey.includes('placeholder')
  );
}

/**
 * Get client-safe public environment variables.
 */
export function getPublicEnv(): PublicEnv {
  return {
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    isConfigured: isSupabaseConfigured(),
  };
}

/**
 * Get server-only environment variables.
 * WARNING: Never invoke or export this to client components.
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv() must only be called in a server environment.');
  }

  return {
    ...getPublicEnv(),
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}
