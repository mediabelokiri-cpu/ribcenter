import {
  getContactSettings,
  getSocialSettings,
  getGeneralSettings,
} from '@/services/settings';
import { SettingsManager } from './settings-manager';

export const metadata = {
  title: 'Pengaturan Situs - Admin KAWAN RIB',
};

export default async function AdminPengaturanPage() {
  const [contact, social, general] = await Promise.all([
    getContactSettings(),
    getSocialSettings(),
    getGeneralSettings(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-[#191919]">Pengaturan Situs</h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#AF191A]/10 text-[#AF191A] border border-[#AF191A]/20">
            Konfigurasi Terpusat
          </span>
        </div>
        <p className="text-xs text-neutral-500 mt-1">
          Kelola kontak resmi, nomor WhatsApp pelayanan, alamat sekretariat, dan kanal media sosial yang terhubung langsung ke halaman publik.
        </p>
      </div>

      {/* Settings Manager Component */}
      <SettingsManager
        initialContact={contact}
        initialSocial={social}
        initialGeneral={general}
      />
    </div>
  );
}
