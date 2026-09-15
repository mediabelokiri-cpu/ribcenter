import { getAllArticlesForAdmin } from '@/services/articles';
import { ArticleListManager } from '../article-list-manager';

export const dynamic = 'force-dynamic';

export default async function AdminBeritaPage() {
  const articles = await getAllArticlesForAdmin();

  return (
    <div className="space-y-6">
      <ArticleListManager
        initialArticles={articles}
        defaultTypeFilter="BERITA"
        pageTitle="Manajemen Berita & Liputan"
        pageSubtitle="Kelola rilis berita resmi, liputan kegiatan lapangan, program advokasi, dan siaran pers."
      />
    </div>
  );
}
