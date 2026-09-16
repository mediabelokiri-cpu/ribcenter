import type { Metadata } from 'next';
import { getAllAspirationsForAdmin } from '@/services/aspirations';
import { AspirasiInboxManager } from './aspirasi-inbox-manager';

export const metadata: Metadata = {
  title: 'Kotak Masuk Aspirasi Warga - Admin RIB CENTER',
  description: 'Kelola aspirasi, saran, dan pengaduan langsung dari warga masyarakat.',
};

export default async function AdminAspirasiPage() {
  const aspirations = await getAllAspirationsForAdmin();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#191919]">
              Kotak Masuk Aspirasi Warga
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20">
              Kanal Partisipasi
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Pantau, verifikasi, dan tindak lanjuti aspirasi serta aduan langsung dari masyarakat. Seluruh data pelapor dan catatan internal dijaga kerahasiaannya.
          </p>
        </div>
      </div>

      {/* Interactive Inbox Manager */}
      <AspirasiInboxManager initialAspirations={aspirations} />
    </div>
  );
}
