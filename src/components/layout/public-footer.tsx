import Image from 'next/image';
import Link from 'next/link';
import { getContactSettings, getSocialSettings, formatWhatsAppUrl } from '@/services/settings';

export async function PublicFooter() {
  const [contact, social] = await Promise.all([
    getContactSettings(),
    getSocialSettings(),
  ]);

  const waUrl = formatWhatsAppUrl(
    contact.whatsapp || '081155667788',
    'Halo Tim RIB CENTER, saya ingin menghubungi sekretariat Rahmat Ichwan Bahtiar.'
  );

  const mapEmbedSrc =
    contact.map_embed_url?.trim() ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127339.69748682669!2d119.2612711!3d-3.432859!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2d94943f773b4329%3A0x3030bfbcaf770b0!2sPolewali%20Mandar%2C%20Sulawesi%20Barat!5e0!3m2!1sid!2sid!4v1700000000000!5m2!1sid!2sid';

  const mapsSearchUrl = contact.address
    ? `https://maps.google.com/?q=${encodeURIComponent(contact.address)}`
    : 'https://maps.google.com/?q=Kab.+Polewali+Mandar,+Provinsi+Sulawesi+Barat';

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-xs text-neutral-400">
      {/* Upper Main Footer */}
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Identity & Summary */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform shrink-0">
                <Image
                  src="/logo.png"
                  alt="RIB CENTER Logo"
                  width={36}
                  height={36}
                  className="object-contain max-h-8 w-auto"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-black text-lg tracking-tight text-white group-hover:text-[#FFCC00] transition-colors leading-none">
                  RIB CENTER
                </span>
              </div>
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              Platform resmi penyajian rekam kerja, transparansi kebijakan, arsip dokumentasi kegiatan, serta kanal aduan dan aspirasi langsung masyarakat.
            </p>

            <div className="pt-1 flex items-center gap-2.5 flex-wrap">
              {/* WhatsApp */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#25D366] hover:border-[#25D366]/40 hover:bg-[#25D366]/10 transition-all shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              {/* Facebook */}
              {social.facebook && (
                <a
                  href={social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  title="Facebook"
                  className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#1877F2] hover:border-[#1877F2]/40 hover:bg-[#1877F2]/10 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}

              {/* Instagram */}
              {social.instagram && (
                <a
                  href={social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  title="Instagram"
                  className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#E4405F] hover:border-[#E4405F]/40 hover:bg-[#E4405F]/10 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              )}

              {/* TikTok */}
              {social.tiktok && (
                <a
                  href={social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok"
                  title="TikTok"
                  className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:border-neutral-600 hover:bg-neutral-800 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
              )}

              {/* YouTube */}
              {social.youtube && (
                <a
                  href={social.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  title="YouTube"
                  className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#FF0000] hover:border-[#FF0000]/40 hover:bg-[#FF0000]/10 transition-all shadow-xs"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Navigasi Kanal Utama */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">
              Kanal Utama
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/tentang" className="hover:text-white transition-colors">
                  Tentang Profil
                </Link>
              </li>
              <li>
                <Link href="/rekam-kerja" className="hover:text-white transition-colors">
                  Rekam Kerja
                </Link>
              </li>
              <li>
                <Link href="/kabar" className="hover:text-white transition-colors">
                  Kabar &amp; Gagasan
                </Link>
              </li>
              <li>
                <Link href="/galeri" className="hover:text-white transition-colors">
                  Galeri Foto &amp; Video
                </Link>
              </li>
            </ul>
          </div>

          {/* Informasi Hukum */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">
              Informasi Hukum
            </span>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/kebijakan-privasi" className="hover:text-white transition-colors">
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link href="/syarat-ketentuan" className="hover:text-white transition-colors">
                  Syarat &amp; Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/kontak" className="hover:text-white transition-colors">
                  Kontak &amp; Sekretariat
                </Link>
              </li>
            </ul>
          </div>

          {/* Lokasi Kantor / Peta Maps */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-white block">
              Lokasi Kantor
            </span>
            <div className="space-y-2 text-xs">
              <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 aspect-[16/10] w-full">
                <iframe
                  title="Peta Lokasi Kantor Sekretariat RIB CENTER"
                  src={mapEmbedSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>
              <p className="text-[11px] text-neutral-400 leading-snug">
                {contact.address || 'Jl. Pahlawan No. 45, Kab. Polewali Mandar, Provinsi Sulawesi Barat 91311'}
              </p>
              <a
                href={mapsSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#FFCC00] hover:underline"
              >
                <span>Buka Google Maps</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright Centered 1 Baris */}
      <div className="border-t border-neutral-900 bg-black py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center text-center text-xs text-neutral-400">
          <p>
            &copy; 2026 RIB CENTER | Dikembangkan Oleh :{' '}
            <a
              href="https://labide.site/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-neutral-200 hover:text-[#FFCC00] hover:underline transition-colors"
            >
              LABIDE - Digital Creative Hub.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
