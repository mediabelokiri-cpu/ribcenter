import { getOrganizations } from '@/services/profile';
import { OrganizationManager } from './organization-manager';

export const dynamic = 'force-dynamic';

export default async function AdminOrganizationPage() {
  // Load all organizations including unpublished for admin
  const items = await getOrganizations(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Profil &amp; Rekam Jejak
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-0.5">
            Rekam Organisasi
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Kelola riwayat kepengurusan, peran, dan keaktifan organisasi Rahmat Ichwan Bahtiar.
          </p>
        </div>
      </div>

      <OrganizationManager initialItems={items} />
    </div>
  );
}
