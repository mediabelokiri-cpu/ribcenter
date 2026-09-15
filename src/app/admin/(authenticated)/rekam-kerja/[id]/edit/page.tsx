import { notFound } from 'next/navigation';
import { getActivityByIdForAdmin, getActivityCategories } from '@/services/activities';
import { ActivityForm } from '../../activity-form';

export const dynamic = 'force-dynamic';

interface EditRekamKerjaPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminEditRekamKerjaPage({ params }: EditRekamKerjaPageProps) {
  const { id } = await params;
  const [activity, categories] = await Promise.all([
    getActivityByIdForAdmin(id),
    getActivityCategories(),
  ]);

  if (!activity) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-4">
      <ActivityForm initialData={activity} categories={categories} isEditing={true} />
    </div>
  );
}
