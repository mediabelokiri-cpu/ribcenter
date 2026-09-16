import Link from 'next/link';

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-neutral-200 text-xs text-neutral-600">
      {/* Upper Main Footer */}
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Identity & Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-[#AF191A] border-2 border-[#FFCC00] flex items-center justify-center text-[#FFCC00] font-mono font-black text-sm shadow-sm group-hover:scale-105 transition-transform shrink-0">
                RIB
              </div>
              <div className="flex flex-col text-left">
                <span className="font-black text-lg tracking-tight text-[#191919] group-hover:text-[#AF191A] transition-colors leading-none">
                  KAWAN RIB
                </span>
                <span className="text-[10px] tracking-wider uppercase text-neutral-500 font-semibold mt-1">
                  Rahmat Ichwan Bahtiar
                </span>
              </div>
            </Link>

            <p className="text-xs text-neutral-500 leading-relaxed max-w-sm">
              Platform resmi penyajian rekam kerja, transparansi kebijakan, arsip dokumentasi kegiatan, serta kanal aduan dan aspirasi langsung masyarakat.
            </p>

            <div className="pt-1">
              <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20">
                Informasi &amp; Akuntabilitas Publik
              </span>
            </div>
          </div>

          {/* Navigasi Kanal Utama */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#191919] block">
              Kanal Utama
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-[#AF191A] transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-[#AF191A] transition-colors">
                  Tentang Profil
                </Link>
              </li>
              <li>
                <Link href="/rekam-kerja" className="hover:text-[#AF191A] transition-colors">
                  Rekam Kerja
                </Link>
              </li>
              <li>
                <Link href="/kabar" className="hover:text-[#AF191A] transition-colors">
                  Kabar &amp; Gagasan
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-[#AF191A] transition-colors">
                  Galeri Foto &amp; Video
                </Link>
              </li>
            </ul>
          </div>

          {/* Partisipasi & Kontak */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#191919] block">
              Partisipasi Warga
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/aspirasi"
                  className="font-semibold text-[#AF191A] hover:underline flex items-center gap-1"
                >
                  <span>Kirim Aspirasi</span>
                  <span>&rarr;</span>
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-[#AF191A] transition-colors">
                  Kontak &amp; Sekretariat
                </Link>
              </li>
              <li>
                <a
                  href="https://wa.me/6281155667788"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#25D366] transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]"></span>
                  <span>WhatsApp Pelayanan</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:kontak@kawanrib.id"
                  className="hover:text-[#AF191A] transition-colors"
                >
                  kontak@kawanrib.id
                </a>
              </li>
            </ul>
          </div>

          {/* Dokumen Hukum & Akses */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#191919] block">
              Informasi Hukum
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/kebijakan-privasi" className="hover:text-[#AF191A] transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/syarat-ketentuan" className="hover:text-[#AF191A] transition-colors">
                  Syarat &amp; Ketentuan
                </Link>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-mono text-[11px] transition-colors"
                >
                  <span>Portal CMS</span>
                  <span>&rarr;</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Principles */}
      <div className="border-t border-neutral-200 bg-neutral-50/70 py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-[11px] text-neutral-500">
          <div>
            &copy; {currentYear} <strong>KAWAN RIB</strong> — Rahmat Ichwan Bahtiar. Seluruh hak cipta dilindungi.
          </div>
          <div className="flex items-center gap-4 text-[10px] font-medium">
            <Link href="/kebijakan-privasi" className="hover:underline">
              Privasi Warga
            </Link>
            <span>•</span>
            <Link href="/syarat-ketentuan" className="hover:underline">
              Ketentuan Layanan
            </Link>
            <span>•</span>
            <span className="text-neutral-400">Kalimantan Timur, Indonesia</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
