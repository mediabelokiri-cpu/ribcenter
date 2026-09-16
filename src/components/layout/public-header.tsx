'use client';

import Image from 'next/image';
import Link from 'next/link';

interface PublicHeaderProps {
  activeRoute?: string;
}

export function PublicHeader({ activeRoute = '/' }: PublicHeaderProps) {
  const navLinks = [
    { href: '/', label: 'Beranda', key: '/' },
    { href: '/tentang', label: 'Tentang', key: '/tentang' },
    { href: '/rekam-kerja', label: 'Rekam Kerja', key: '/rekam-kerja' },
    { href: '/kabar', label: 'Kabar', key: '/kabar' },
    { href: '/galeri', label: 'Galeri', key: '/galeri' },
    { href: '/aspirasi', label: 'Aspirasi', key: '/aspirasi' },
    { href: '/kontak', label: 'Kontak', key: '/kontak' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-neutral-200 text-neutral-900 shadow-xs">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand: Logo & Logotype (LOGO + RIB CENTER) tanpa Rahmat Ichwan Bahtiar */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 shrink-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="RIB CENTER Logo"
              width={36}
              height={36}
              className="object-contain max-h-9 w-auto group-hover:scale-105 transition-transform"
              priority
            />
          </div>
          <span className="font-black text-lg sm:text-xl tracking-tight text-neutral-900 group-hover:text-[#AF191A] transition-colors leading-none">
            RIB CENTER
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs lg:text-sm font-medium">
          {navLinks.map((link) => {
            const isActive =
              activeRoute === link.key ||
              (link.key !== '/' && activeRoute.startsWith(link.key));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? 'text-[#AF191A] font-bold border-b-2 border-[#AF191A]'
                    : 'text-neutral-600 hover:text-[#AF191A]'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Button: Aspirasi / CMS */}
        <div className="flex items-center gap-2">
          <Link
            href="/aspirasi"
            className="hidden sm:inline-flex px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-[#AF191A] text-white hover:bg-[#8e1415] transition-colors shadow-xs"
          >
            Kirim Aspirasi
          </Link>
          <Link
            href="/admin"
            className="px-2.5 py-1.5 text-[11px] font-mono text-neutral-500 hover:text-[#AF191A] transition-colors"
            title="Masuk CMS Admin"
          >
            CMS
          </Link>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden px-4 py-2 border-t border-neutral-200 bg-neutral-50 flex items-center gap-4 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
        {navLinks.map((link) => {
          const isActive =
            activeRoute === link.key ||
            (link.key !== '/' && activeRoute.startsWith(link.key));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`py-1 px-1.5 font-medium transition-colors ${
                isActive
                  ? 'text-[#AF191A] font-bold border-b border-[#AF191A]'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
