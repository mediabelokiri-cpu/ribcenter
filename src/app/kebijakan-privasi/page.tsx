import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';

export const metadata = {
  title: 'Kebijakan Privasi - KAWAN RIB (Rahmat Ichwan Bahtiar)',
  description:
    'Kebijakan privasi dan komitmen perlindungan kerahasiaan data warga, nomor kontak, serta pengaduan pada platform Rahmat Ichwan Bahtiar.',
};

export default function KebijakanPrivasiPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      <PublicHeader />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Header Title */}
        <div className="border-b border-neutral-200 pb-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
            Informasi Hukum &amp; Transparansi
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#191919] tracking-tight">
            Kebijakan Privasi
          </h1>
          <p className="text-xs text-neutral-500">
            Terakhir diperbarui: 16 September 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#191919]">1. Komitmen Perlindungan Privasi</h2>
            <p>
              Platform <strong>KAWAN RIB (Rahmat Ichwan Bahtiar)</strong> berkomitmen penuh untuk melindungi privasi dan keamanan data setiap warga negara yang mengakses situs ini serta memanfaatkan kanal partisipasi publik. Kami menyadari bahwa kepercayaan publik adalah pondasi utama akuntabilitas kepemimpinan.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#191919]">2. Data yang Dikumpulkan pada Kanal Aspirasi</h2>
            <p>
              Saat Anda menyampaikan aspirasi atau aduan melalui formulir publik kami, informasi yang dikumpulkan meliputi:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>Nama lengkap pelapor.</li>
              <li>Nomor kontak aktif (Nomor WhatsApp atau alamat surel/email).</li>
              <li>Wilayah domisili (Kabupaten/Kota dan Kecamatan).</li>
              <li>Pokok permasalahan, kategori bidang, uraian pesan, dan berkas lampiran pendukung (opsional).</li>
            </ul>
          </section>

          <section className="space-y-2 p-4 rounded-xl bg-amber-50/60 border border-amber-200">
            <h2 className="text-sm font-bold text-amber-950 flex items-center gap-1.5">
              <span>🔒</span> Jaminan Kerahasiaan Khusus Data Aspirasi
            </h2>
            <p className="text-xs text-amber-900 leading-relaxed">
              Seluruh data aspirasi, nomor kontak warga, serta catatan tindak lanjut internal berstatus <strong>RAHASIA</strong>. Sistem kami dirancang dengan prinsip <em>Privacy by Design</em> di mana data aspirasi tidak pernah ditampilkan ke publik, tidak dapat dicari oleh pihak ketiga, dan dilindungi oleh <em>Row Level Security</em> (RLS) pada basis data.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#191919]">3. Penggunaan Informasi</h2>
            <p>
              Informasi yang Anda sampaikan hanya digunakan secara eksklusif untuk:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>Verifikasi keabsahan laporan atau permohonan advokasi masyarakat.</li>
              <li>Menghubungi Anda kembali terkait progres atau klarifikasi tindak lanjut.</li>
              <li>Penyusunan telaah kebijakan atau agenda kunjungan kerja/reses di daerah terkait.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#191919]">4. Larangan Pembagian Data kepada Pihak Ketiga</h2>
            <p>
              Kami tidak akan pernah menjual, menyewakan, memperdagangkan, atau membagikan nomor kontak dan data pribadi warga kepada pihak ketiga mana pun untuk tujuan komersial, periklanan, atau kampanye politik terselubung.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#191919]">5. Hak Warga atas Data Pribadi</h2>
            <p>
              Sebagai pelapor, Anda berhak memohon pembaruan data kontak atau penghapusan rekaman aspirasi Anda dari arsip internal kami dengan menghubungi sekretariat melalui surel resmi di <a href="mailto:kontak@kawanrib.id" className="text-[#AF191A] font-semibold underline">kontak@kawanrib.id</a> dengan menyertakan Nomor Tiket Aspirasi yang bersangkutan.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
