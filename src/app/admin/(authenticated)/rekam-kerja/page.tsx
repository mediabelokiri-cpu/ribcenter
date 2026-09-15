import { getAllActivitiesForAdmin, getActivityCategories } from '@/services/activities';
import { ActivityListManager } from './activity-list-manager';

export const dynamic = 'force-dynamic';

export default async function AdminRekamKerjaPage() {
  const [activities, categories] = await Promise.all([
    getAllActivitiesForAdmin(),
    getActivityCategories(),
  ]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <ActivityListManager initialActivities={activities} categories={categories} />
    </div>
  );
}
