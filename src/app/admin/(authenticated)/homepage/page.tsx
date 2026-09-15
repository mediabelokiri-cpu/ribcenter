import { getHomepageSections } from '@/services/homepage';
import { HomepageSectionManager } from './homepage-section-manager';

export const dynamic = 'force-dynamic';

export default async function AdminHomepagePage() {
  const sections = await getHomepageSections(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Tampilan &amp; Layout
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-0.5">
            Homepage Manager
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Atur visibilitas, urutan tampilan, dan narasi pendukung untuk setiap section di halaman utama.
          </p>
        </div>
      </div>

      <HomepageSectionManager initialSections={sections} />
    </div>
  );
}
