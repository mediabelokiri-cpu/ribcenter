'use client';

import Link from 'next/link';

interface PublicHeaderProps {
  activeRoute?: '/' | '/tentang' | '/rekam-kerja' | '/kabar' | '/galeri' | '/aspirasi' | '/kontak';
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
    <header className="sticky top-0 z-50 bg-[#191919]/95 backdrop-blur border-b border-neutral-800 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo Inisial & Nama KAWAN RIB */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-[#AF191A] border-2 border-[#FFCC00] flex items-center justify-center text-[#FFCC00] font-mono font-black text-sm shadow-md group-hover:scale-105 transition-transform shrink-0">
            RIB
          </div>
          <div className="flex flex-col">
            <span className="font-black text-base sm:text-lg tracking-tight text-white group-hover:text-[#FFCC00] transition-colors leading-none">
              KAWAN RIB
            </span>
            <span className="text-[10px] tracking-wider uppercase text-neutral-400 font-medium mt-1">
              Rahmat Ichwan Bahtiar
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 text-xs lg:text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = activeRoute === link.key;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors py-1 ${
                  isActive
                    ? 'text-[#FFCC00] font-bold border-b-2 border-[#FFCC00]'
                    : 'text-neutral-300 hover:text-white'
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
            className="px-2.5 py-1.5 text-[11px] font-mono text-neutral-400 hover:text-[#FFCC00] transition-colors"
            title="Masuk CMS Admin"
          >
            CMS
          </Link>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden px-4 py-2 border-t border-neutral-800 bg-[#141414] flex items-center gap-4 overflow-x-auto text-xs whitespace-nowrap scrollbar-none">
        {navLinks.map((link) => {
          const isActive = activeRoute === link.key;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`py-1 px-1.5 font-medium transition-colors ${
                isActive
                  ? 'text-[#FFCC00] font-bold border-b border-[#FFCC00]'
                  : 'text-neutral-400 hover:text-neutral-200'
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
