import { getActivityCategories } from '@/services/activities';
import { CategoryManager } from './category-manager';

export const dynamic = 'force-dynamic';

export default async function AdminRekamKerjaCategoriesPage() {
  const categories = await getActivityCategories();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <CategoryManager initialCategories={categories} />
    </div>
  );
}
