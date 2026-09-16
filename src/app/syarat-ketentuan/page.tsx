import { PublicHeader } from '@/components/layout/public-header';
import { PublicFooter } from '@/components/layout/public-footer';

export const metadata = {
  title: 'Syarat & Ketentuan - KAWAN RIB (Rahmat Ichwan Bahtiar)',
  description:
    'Syarat dan ketentuan penggunaan platform keterbukaan informasi publik dan etika kanal aspirasi Rahmat Ichwan Bahtiar.',
};

export default function SyaratKetentuanPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#191919]">
      <PublicHeader />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* Header Title */}
        <div className="border-b border-neutral-200 pb-6 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#AF191A]">
            Ketentuan Layanan &amp; Etika Publik
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#191919] tracking-tight">
            Syarat &amp; Ketentuan Penggunaan
          </h1>
          <p className="text-xs text-neutral-500">
            Terakhir diperbarui: 16 September 2026
          </p>
        </div>

        {/* Content Body */}
        <div className="prose prose-neutral max-w-none text-xs sm:text-sm text-neutral-700 space-y-6 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#191919]">1. Ketentuan Umum</h2>
            <p>
              Dengan mengakses dan menggunakan situs web <strong>KAWAN RIB (Platform Informasi &amp; Akuntabilitas Publik Rahmat Ichwan Bahtiar)</strong>, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat dengan seluruh syarat dan ketentuan yang tercantum di halaman ini.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#191919]">2. Hak Cipta &amp; Pengutipan Konten Publik</h2>
            <p>
              Seluruh materi informasi, dokumentasi kegiatan, data rekam kerja, dan artikel gagasan kebijakan yang dipublikasikan di situs ini ditujukan untuk edukasi publik dan keterbukaan informasi. Pengutipan atau penyebarluasan konten diperkenankan dengan syarat:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>Menyebutkan sumber rujukan secara jelas (misal: <em>Sumber: KAWAN RIB — Rahmat Ichwan Bahtiar</em>).</li>
              <li>Tidak mengubah substansi atau memotong konteks informasi yang dapat menimbulkan disinformasi atau fitnah.</li>
              <li>Tidak memanfaatkan materi visual/foto untuk kepentingan komersial tanpa izin tertulis.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#191919]">3. Pedoman Etika Penyampaian Aspirasi</h2>
            <p>
              Kanal aspirasi warga disediakan sebagai media konstruktif antara masyarakat dan figur publik. Setiap pengguna wajib mematuhi etika berikut saat mengirimkan laporan:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-neutral-600">
              <li>Menyampaikan fakta yang benar, jujur, dan dapat dipertanggungjawabkan.</li>
              <li>Tidak memuat konten yang mengandung ujaran kebencian, pencemaran nama baik, SARA, atau pornografi.</li>
              <li>Tidak menyalahgunakan formulir untuk penipuan (*scam*), spam, atau pengiriman virus/malware.</li>
            </ul>
            <p className="text-xs text-neutral-500 italic">
              Pengelola berhak membatalkan dan menghapus aspirasi yang terbukti melanggar pedoman etika di atas.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#191919]">4. Batasan Tanggung Jawab</h2>
            <p>
              Kami berupaya maksimal menyajikan data yang akurat dan terkini. Namun demikian, platform ini disediakan apa adanya (*as is*). Tindak lanjut atas setiap aspirasi warga disesuaikan dengan skala prioritas, kewenangan perundang-undangan, dan ketersediaan alokasi program yang berlaku.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-base font-bold text-[#191919]">5. Kontak Korespondensi</h2>
            <p>
              Pertanyaan atau klarifikasi mengenai Syarat dan Ketentuan ini dapat disampaikan melalui surat elektronik ke <a href="mailto:kontak@kawanrib.id" className="text-[#AF191A] font-semibold underline">kontak@kawanrib.id</a>.
            </p>
          </section>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
