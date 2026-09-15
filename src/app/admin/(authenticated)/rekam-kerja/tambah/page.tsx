import { getActivityCategories } from '@/services/activities';
import { ActivityForm } from '../activity-form';

export const dynamic = 'force-dynamic';

export default async function AdminTambahRekamKerjaPage() {
  const categories = await getActivityCategories();

  return (
    <div className="max-w-4xl mx-auto py-4">
      <ActivityForm categories={categories} isEditing={false} />
    </div>
  );
}
