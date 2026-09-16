import type { MetadataRoute } from 'next';
import { getPublishedArticles } from '@/services/articles';
import { getPublishedActivities } from '@/services/activities';
import { getPublishedAlbums } from '@/services/media';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');

  // 1. Static Primary Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tentang`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/rekam-kerja`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kabar`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/kabar/berita`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kabar/gagasan`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/galeri`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/galeri/foto`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/galeri/video`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/aspirasi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/kebijakan-privasi`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/syarat-ketentuan`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.4,
    },
  ];

  // 2. Dynamic Routes (Articles, Activities, Albums)
  try {
    const [articles, activities, albums] = await Promise.all([
      getPublishedArticles(),
      getPublishedActivities(),
      getPublishedAlbums(),
    ]);

    const articleRoutes: MetadataRoute.Sitemap = articles.map((article) => ({
      url: `${baseUrl}/kabar/${article.slug}`,
      lastModified: article.updated_at ? new Date(article.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

    const activityRoutes: MetadataRoute.Sitemap = activities.map((activity) => ({
      url: `${baseUrl}/rekam-kerja/${activity.slug}`,
      lastModified: activity.updated_at ? new Date(activity.updated_at) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    const albumRoutes: MetadataRoute.Sitemap = albums.map((album) => ({
      url: `${baseUrl}/galeri/foto/${album.slug}`,
      lastModified: album.updated_at ? new Date(album.updated_at) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));

    return [...staticRoutes, ...activityRoutes, ...articleRoutes, ...albumRoutes];
  } catch (error) {
    console.error('Error generating dynamic sitemap:', error);
    return staticRoutes;
  }
}
