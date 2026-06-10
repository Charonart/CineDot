// ─── Cinema Corner Domain Types ────────────────────────────────────────────

export type ArticleCategory = 'reviews' | 'blog' | 'backstage';

export const ARTICLE_CATEGORY_LABELS: Record<ArticleCategory, string> = {
  reviews: 'Bình luận phim',
  blog: 'Blog điện ảnh',
  backstage: 'Hậu trường',
};

export interface RelatedArticle {
  id: string;
  slug: string;
  title: string;
  imageUrl: string;
  category: ArticleCategory;
  href: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content?: string;
  category: ArticleCategory;
  categoryLabel: string;
  author: string;
  authorAvatar: string;
  authorBio?: string;
  publishedAt: string;
  imageUrl: string;
  readTime: number;
  isFeatured: boolean;
  tags: string[];
  rating?: number;
  relatedArticles?: RelatedArticle[];
  href: string;
}

export interface ArticleList {
  items: Article[];
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
}
