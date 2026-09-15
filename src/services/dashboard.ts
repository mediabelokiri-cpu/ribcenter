import { getAllActivitiesForAdmin } from '@/services/activities';
import { getAllArticlesForAdmin } from '@/services/articles';
import { getAllAlbumsForAdmin } from '@/services/media';
import { getAllAspirationsForAdmin } from '@/services/aspirations';
import type { Activity, Aspiration } from '@/types/database';

export interface DashboardStats {
  counts: {
    totalActivities: number;
    totalArticles: number;
    totalAlbums: number;
    totalAspirations: number;
    pendingAspirations: number;
  };
  latestAspirations: Aspiration[];
  latestActivities: Activity[];
}

/**
 * Aggregates statistics and recent records for the Admin Dashboard.
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const [activities, articles, albums, aspirations] = await Promise.all([
    getAllActivitiesForAdmin(),
    getAllArticlesForAdmin(),
    getAllAlbumsForAdmin(),
    getAllAspirationsForAdmin(),
  ]);

  const pendingAspirations = aspirations.filter(
    (a) => a.status === 'BARU'
  ).length;

  return {
    counts: {
      totalActivities: activities.length,
      totalArticles: articles.length,
      totalAlbums: albums.length,
      totalAspirations: aspirations.length,
      pendingAspirations,
    },
    latestAspirations: aspirations.slice(0, 5),
    latestActivities: activities.slice(0, 5),
  };
}
