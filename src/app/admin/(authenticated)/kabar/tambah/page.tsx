import { getAllActivitiesForAdmin } from '@/services/activities';
import { ArticleForm } from '../article-form';
import type { ArticleType } from '@/types/database';

export const dynamic = 'force-dynamic';

interface TambahPageProps {
  searchParams: Promise<{ type?: string }>;
}

export default async function AdminTambahKabarPage({ searchParams }: TambahPageProps) {
  const resolvedParams = await searchParams;
  const defaultType: ArticleType =
    resolvedParams.type === 'GAGASAN' ? 'GAGASAN' : 'BERITA';

  const activities = await getAllActivitiesForAdmin();

  return (
    <div className="max-w-4xl mx-auto py-4">
      <ArticleForm
        activities={activities}
        defaultType={defaultType}
      />
    </div>
  );
}
