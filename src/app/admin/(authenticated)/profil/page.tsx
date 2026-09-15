import { getProfileForAdmin } from '@/services/profile';
import { ProfileForm } from './profile-form';

export const dynamic = 'force-dynamic';

export default async function AdminProfilePage() {
  const profile = await getProfileForAdmin();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
            Manajemen Konten
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-[#191919] mt-0.5">
            Profil Utama Rahmat Ichwan Bahtiar
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Kelola data biografi, visi, misi, dan informasi publik utama yang tampil di beranda dan halaman tentang.
          </p>
        </div>
      </div>

      <ProfileForm initialProfile={profile} />
    </div>
  );
}
