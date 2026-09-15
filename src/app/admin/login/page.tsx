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
        <div className="p-3.5 mb-5 text-xs rounded-lg bg-[#FFCC00]/15 text-[#191919] border border-[#FFCC00]/40">
          <strong>Catatan Pengembang:</strong> Variabel lingkungan Supabase belum dikonfigurasi. Silakan isi kredensial di file <code className="font-mono font-semibold">.env.local</code> untuk mengaktifkan autentikasi.
        </div>
      )}

      {state?.error && (
        <div className="p-3.5 mb-5 text-xs rounded-lg bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/30">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold text-neutral-700 mb-1"
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
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#AF191A]"
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-xs font-semibold text-neutral-700 mb-1"
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
            className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-300 bg-white text-[#191919] focus:outline-none focus:ring-2 focus:ring-[#AF191A]"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#AF191A] hover:bg-[#921415] rounded-lg transition-colors disabled:opacity-50 mt-2 shadow-xs"
        >
          {isPending ? 'Memproses...' : 'Masuk ke Admin CMS'}
        </button>
      </form>
    </>
  );
}

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-[#F9FAFB] text-[#191919]">
      <div className="max-w-md w-full p-8 bg-white rounded-2xl shadow-sm border border-neutral-200">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#191919] border-2 border-[#AF191A] text-[#FFCC00] font-mono font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
            RIB
          </div>
          <span className="inline-block px-3 py-0.5 text-xs font-bold tracking-wide uppercase rounded-full bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20 mb-2">
            Admin CMS
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#191919]">Masuk Administrator</h1>
          <p className="text-xs text-neutral-500 mt-1">
            Khusus pengelola internal situs Rahmat Ichwan Bahtiar.
          </p>
        </div>

        <Suspense fallback={<div className="text-center py-6 text-xs text-neutral-500">Memuat formulir...</div>}>
          <LoginForm />
        </Suspense>

        <div className="mt-6 pt-4 border-t border-neutral-100 text-center">
          <Link
            href="/"
            className="text-xs text-neutral-500 hover:text-[#AF191A] underline transition-colors"
          >
            &larr; Kembali ke Beranda Publik
          </Link>
        </div>
      </div>
    </main>
  );
}
