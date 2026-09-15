import { getAllArticlesForAdmin } from '@/services/articles';
import { ArticleListManager } from './article-list-manager';

export const dynamic = 'force-dynamic';

export default async function AdminKabarPage() {
  const articles = await getAllArticlesForAdmin();

  return (
    <div className="space-y-6">
      <ArticleListManager
        initialArticles={articles}
        defaultTypeFilter="ALL"
        pageTitle="Manajemen Kabar & Publikasi"
        pageSubtitle="Pusat publikasi terpadu untuk berita liputan kegiatan dan catatan gagasan pemikiran publik."
      />
    </div>
  );
}
