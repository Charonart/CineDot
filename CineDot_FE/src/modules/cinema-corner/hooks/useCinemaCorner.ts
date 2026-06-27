import { useQuery } from '@tanstack/react-query';
import { cinemaCornerService } from '../services/cinema-corner.service';
import { ArticleCategory } from '../types/cinema-corner.type';

export const cinemaCornerKeys = {
  all: ['cinema-corner'] as const,
  articles: () => [...cinemaCornerKeys.all, 'articles'] as const,
  articlesByCategory: (category?: ArticleCategory) =>
    [...cinemaCornerKeys.articles(), { category }] as const,
  articleDetail: (slug: string) => [...cinemaCornerKeys.all, 'article', slug] as const,
};

export const useArticles = (category?: ArticleCategory) => {
  return useQuery({
    queryKey: cinemaCornerKeys.articlesByCategory(category),
    queryFn: () => cinemaCornerService.getArticles({ category }),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};

export const useArticle = (slug: string) => {
  return useQuery({
    queryKey: cinemaCornerKeys.articleDetail(slug),
    queryFn: () => cinemaCornerService.getArticle(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
};
