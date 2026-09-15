'use client';

import { Suspense, useActionState } from 'react';
import { loginAdmin, type ActionState } from '@/app/admin/actions';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    loginAdmin,
    {}
  );

  return (
    <>
      {reason === 'unconfigured' && (
        <div className="p-3.5 mb-5 text-xs rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
          <strong>Catatan Pengembang:</strong> Variabel lingkungan Supabase belum dikonfigurasi. Silakan isi kredensial di file <code className="font-mono font-semibold">.env.local</code> untuk mengaktifkan autentikasi.
        </div>
      )}

      {state?.error && (
        <div className="p-3.5 mb-5 text-xs rounded-lg bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Email Administrator
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@example.com"
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1"
          >
            Kata Sandi
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 px-4 text-sm font-medium text-white bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200 rounded-lg transition-colors disabled:opacity-50 mt-2"
        >
          {isPending ? 'Memproses...' : 'Masuk ke Admin CMS'}
        </button>
      </form>
    </>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-neutral-100 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-md w-full p-8 bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800">
        <div className="mb-6 text-center">
          <span className="inline-block px-2.5 py-1 text-xs font-semibold tracking-wide uppercase rounded bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 mb-2">
            Admin CMS
          </span>
          <h1 className="text-2xl font-bold tracking-tight">Masuk Administrator</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Khusus pengelola internal situs Rahmat Ichwan Bahtiar.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-6 text-xs text-neutral-500">Memuat formulir...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-center">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 underline"
          >
            &larr; Kembali ke Beranda Publik
          </Link>
        </div>
      </div>
    </main>
  );
}
