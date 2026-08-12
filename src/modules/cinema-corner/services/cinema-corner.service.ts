import { CinemaCornerArticle, ArticleCategory } from '../types/cinema-corner.types';
import { MOCK_CINEMA_ARTICLES } from '../mocks/mockCinemaCornerData';

export async function fetchArticles(category: ArticleCategory = 'ALL'): Promise<CinemaCornerArticle[]> {
  await new Promise((res) => setTimeout(res, 150));
  if (category === 'ALL') {
    return MOCK_CINEMA_ARTICLES;
  }
  return MOCK_CINEMA_ARTICLES.filter((art) => art.category === category);
}

export async function fetchFeaturedArticle(): Promise<CinemaCornerArticle> {
  await new Promise((res) => setTimeout(res, 100));
  const featured = MOCK_CINEMA_ARTICLES.find((art) => art.isFeatured);
  return featured || MOCK_CINEMA_ARTICLES[0];
}

export async function fetchTrendingArticles(): Promise<CinemaCornerArticle[]> {
  await new Promise((res) => setTimeout(res, 100));
  return MOCK_CINEMA_ARTICLES.filter((art) => art.isTrending).sort(
    (a, b) => (a.trendingRank || 99) - (b.trendingRank || 99)
  );
}

export async function fetchArticleBySlug(slug: string): Promise<CinemaCornerArticle | null> {
  await new Promise((res) => setTimeout(res, 100));
  return MOCK_CINEMA_ARTICLES.find((art) => art.slug === slug) || null;
}
