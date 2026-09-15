import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { getPublicEnv, isSupabaseConfigured } from '@/lib/env';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  // Only evaluate /admin routes (except static assets)
  if (!pathname.startsWith('/admin')) {
    return response;
  }

  const isLoginPage = pathname === '/admin/login';

  // If Supabase is not configured yet (e.g. initial clone with placeholders)
  if (!isSupabaseConfigured()) {
    if (!isLoginPage) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('reason', 'unconfigured');
      return NextResponse.redirect(loginUrl);
    }
    return response;
  }

  const { supabaseUrl, supabaseAnonKey } = getPublicEnv();

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If unauthenticated and attempting to access protected admin area
  if (!user && !isLoginPage) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If authenticated user visits /admin/login, redirect to /admin dashboard
  if (user && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
  ],
};
