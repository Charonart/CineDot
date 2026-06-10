// ─── Cinema Corner DTOs ─────────────────────────────────────────────────────

export type ArticleCategory = 'reviews' | 'blog' | 'backstage';

export interface RelatedArticleDTO {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  category: ArticleCategory;
}

export interface ArticleDTO {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: ArticleCategory;
  author: string;
  authorAvatar: string;
  authorBio?: string;
  publishedAt: string;
  imageUrl: string;
  readTime: number;
  isFeatured: boolean;
  tags: string[];
  rating?: number;
  relatedArticles?: RelatedArticleDTO[];
}

export interface ArticleListResponseDTO {
  page: number;
  totalPages: number;
  totalResults: number;
  results: ArticleDTO[];
}
