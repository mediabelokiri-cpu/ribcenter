import { getAllArticlesForAdmin } from '@/services/articles';
import { ArticleListManager } from '../article-list-manager';

export const dynamic = 'force-dynamic';

export default async function AdminGagasanPage() {
  const articles = await getAllArticlesForAdmin();

  return (
    <div className="space-y-6">
      <ArticleListManager
        initialArticles={articles}
        defaultTypeFilter="GAGASAN"
        pageTitle="Manajemen Gagasan & Opini Kebijakan"
        pageSubtitle="Kelola artikel pemikiran, catatan kebijakan, opini publik, dan esai pembangunan daerah."
      />
    </div>
  );
}
