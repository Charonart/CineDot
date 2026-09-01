import type { MetadataRoute } from 'next';

interface SitemapMovieItem {
  slug: string;
  title?: string;
  status: string;
  updated_at: string;
}

interface SitemapCinemaItem {
  slug: string;
  name?: string;
  city?: string;
  is_active: boolean;
  updated_at: string;
}

interface SitemapApiResponse {
  success: boolean;
  data: {
    movies: SitemapMovieItem[];
    cinemas: SitemapCinemaItem[];
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://cinedot.vn').replace(/\/+$/, '');
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cinedot_be.test/api/v1';

  // 1. Static Root Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/movies`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/cinemas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  try {
    const res = await fetch(`${apiUrl}/sitemap`, {
      next: { revalidate: 3600 },
      headers: {
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      return staticRoutes;
    }

    const payload: SitemapApiResponse = await res.json();
    const { movies = [], cinemas = [] } = payload.data || {};

    // 2. Public Active Movies (now_showing & upcoming)
    const movieRoutes: MetadataRoute.Sitemap = movies
      .filter((m) => m.slug && (m.status === 'now_showing' || m.status === 'upcoming'))
      .map((m) => ({
        url: `${baseUrl}/movies/${m.slug}`,
        lastModified: m.updated_at ? new Date(m.updated_at) : new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      }));

    // 3. Public Active Cinemas (is_active = true)
    const cinemaRoutes: MetadataRoute.Sitemap = cinemas
      .filter((c) => c.slug && c.is_active !== false)
      .map((c) => ({
        url: `${baseUrl}/cinemas/${c.slug}`,
        lastModified: c.updated_at ? new Date(c.updated_at) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      }));

    return [...staticRoutes, ...movieRoutes, ...cinemaRoutes];
  } catch (error) {
    console.error('[Sitemap Generation Error]:', error);
    return staticRoutes;
  }
}