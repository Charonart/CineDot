export type ArticleCategory =
  | 'ALL'
  | 'REVIEWS'
  | 'CINEMA_NEWS'
  | 'DIRECTOR_ACTOR'
  | 'BEHIND_SCENES';

export interface CinemaCornerArticle {
  id: string;
  slug: string;
  title: string;
  category: ArticleCategory;
  categoryName: string;
  summary: string;
  imageUrl: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  publishedAt: string;
  readTime: string;
  views: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  trendingRank?: number;

  // Detailed fields for /cinema-corner/[slug]
  ratingScore?: number;
  ratingVerdict?: string;
  pros?: string[];
  cons?: string[];
  quoteText?: string;
  quoteAuthor?: string;
  paragraphs?: string[];
  relatedMovie?: {
    title: string;
    genre: string;
    director: string;
    cast: string;
    posterUrl: string;
    movieSlug: string;
  };
}
