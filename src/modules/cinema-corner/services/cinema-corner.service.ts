import { CinemaCornerArticle, ArticleCategory } from '../types/cinema-corner.types';
import { MOCK_CINEMA_ARTICLES } from '../mocks/mockCinemaCornerData';
import { APP_CONFIG } from '@/shared/constants/config';

export async function fetchArticles(category: ArticleCategory = 'ALL'): Promise<CinemaCornerArticle[]> {
  await new Promise((res) => setTimeout(res, 200));
  if (!APP_CONFIG.USE_MOCK_DATA) return [];
  if (category === 'ALL') {
    return MOCK_CINEMA_ARTICLES;
  }
  return MOCK_CINEMA_ARTICLES.filter((art) => art.category === category);
}

export async function fetchFeaturedArticle(): Promise<CinemaCornerArticle> {
  await new Promise((res) => setTimeout(res, 100));
  if (!APP_CONFIG.USE_MOCK_DATA) throw new Error('No featured article');
  const featured = MOCK_CINEMA_ARTICLES.find((art) => art.isFeatured);
  return featured || MOCK_CINEMA_ARTICLES[0];
}

export async function fetchTrendingArticles(): Promise<CinemaCornerArticle[]> {
  await new Promise((res) => setTimeout(res, 150));
  if (!APP_CONFIG.USE_MOCK_DATA) return [];
  return MOCK_CINEMA_ARTICLES.filter((art) => art.isTrending).sort(
    (a, b) => (a.trendingRank || 99) - (b.trendingRank || 99)
  );
}

export async function fetchArticleBySlug(slug: string): Promise<CinemaCornerArticle | null> {
  await new Promise((res) => setTimeout(res, 100));
  if (!APP_CONFIG.USE_MOCK_DATA) return null;
  return MOCK_CINEMA_ARTICLES.find((art) => art.slug === slug) || null;
}
