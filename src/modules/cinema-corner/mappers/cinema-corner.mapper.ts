import { ArticleDTO, ArticleListResponseDTO, RelatedArticleDTO } from '../dto/cinema-corner.dto';
import { Article, ArticleList, RelatedArticle, ARTICLE_CATEGORY_LABELS } from '../types/cinema-corner.type';
import { appRoutes } from '@/shared/routes/appRoutes';

export const cinemaCornerMapper = {
  toRelatedArticleModel: (dto: RelatedArticleDTO): RelatedArticle => ({
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    imageUrl: dto.imageUrl,
    category: dto.category,
    href: appRoutes.cinemaArticle(dto.slug),
  }),

  toArticleModel: (dto: ArticleDTO): Article => ({
    id: dto.id,
    slug: dto.slug,
    title: dto.title,
    excerpt: dto.excerpt,
    content: dto.content,
    category: dto.category,
    categoryLabel: ARTICLE_CATEGORY_LABELS[dto.category],
    author: dto.author,
    authorAvatar: dto.authorAvatar,
    authorBio: dto.authorBio,
    publishedAt: dto.publishedAt,
    imageUrl: dto.imageUrl,
    readTime: dto.readTime,
    isFeatured: dto.isFeatured,
    tags: dto.tags,
    rating: dto.rating,
    relatedArticles: dto.relatedArticles?.map(cinemaCornerMapper.toRelatedArticleModel),
    href: appRoutes.cinemaArticle(dto.slug),
  }),

  toArticleListModel: (dto: ArticleListResponseDTO): ArticleList => ({
    items: (dto.results || []).map(cinemaCornerMapper.toArticleModel),
    currentPage: dto.page || 1,
    totalPages: dto.totalPages || 1,
    totalItems: dto.totalResults || 0,
    hasNext: (dto.page || 1) < (dto.totalPages || 1),
  }),
};
