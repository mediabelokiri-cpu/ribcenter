import { getTimeline } from '@/services/profile';
import { TimelineManager } from './timeline-manager';

export const dynamic = 'force-dynamic';

export default async function AdminTimelinePage() {
  // Load all timeline items including unpublished for admin
  const items = await getTimeline(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-neutral-200 dark:border-neutral-800">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Profil &amp; Rekam Jejak
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mt-0.5">
            Perjalanan Politik &amp; Linimasa
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Kelola tonggak peristiwa, karier, dan perjalanan politik Rahmat Ichwan Bahtiar secara kronologis.
          </p>
        </div>
      </div>

      <TimelineManager initialItems={items} />
    </div>
  );
}
