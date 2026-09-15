import { notFound } from 'next/navigation';
import { getArticleByIdForAdmin } from '@/services/articles';
import { getAllActivitiesForAdmin } from '@/services/activities';
import { ArticleForm } from '../../article-form';

export const dynamic = 'force-dynamic';

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditKabarPage({ params }: EditPageProps) {
  const { id } = await params;

  const [article, activities] = await Promise.all([
    getArticleByIdForAdmin(id),
    getAllActivitiesForAdmin(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-4">
      <ArticleForm
        initialData={article}
        activities={activities}
      />
    </div>
  );
}
